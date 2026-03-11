
import bcrypt from "bcrypt";
import { pool } from "../Database/db.js";
import { supabase } from "../config/supabase.js";

export const createTeacher = async (req, res) => {

    const client = await pool.connect();

    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admin can create teacher"
            });
        }

        const {
            name,
            email,
            password,
            employee_number,
            department,
            phone
        } = req.body;

        if (!name || !email || !password || !employee_number) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        await client.query("BEGIN");

        /* ========================
        EMAIL CHECK
        ======================== */

        const emailCheck = await client.query(
            "SELECT id FROM users WHERE email=$1",
            [email]
        );

        if (emailCheck.rowCount > 0) {

            await client.query("ROLLBACK");

            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });

        }

        /* ========================
        UPLOAD IMAGE TO SUPABASE
        ======================== */



        let image_url = null;

        if (req.file) {

            const fileName = `teachers/${Date.now()}-${req.file.originalname}`;

            const { error } = await supabase.storage
                .from("teacher-images")
                .upload(fileName, req.file.buffer, {
                    contentType: req.file.mimetype
                });

            if (error) throw error;

            const { data } = supabase.storage
                .from("teacher-images")
                .getPublicUrl(fileName);

            image_url = data.publicUrl;
        }
        /* ========================
        CREATE USER
        ======================== */

        const hash = await bcrypt.hash(password, 10);

        const userResult = await client.query(
            `INSERT INTO users(name,email,password_hash,role)
            VALUES($1,$2,$3,'teacher')
            RETURNING id`,
            [name, email, hash]
        );

        const userId = userResult.rows[0].id;

        /* ========================
        EMPLOYEE CHECK
        ======================== */

        const duplicate = await client.query(
            "SELECT id FROM teachers WHERE employee_number=$1",
            [employee_number]
        );

        if (duplicate.rowCount > 0) {

            await client.query("ROLLBACK");

            return res.status(409).json({
                success: false,
                message: "Employee number already exists"
            });

        }

        /* ========================
        CREATE TEACHER
        ======================== */

        const teacherResult = await client.query(
            `INSERT INTO teachers
            (user_id,employee_number,department,phone,image_url)
            VALUES($1,$2,$3,$4,$5)
            RETURNING *`,
            [
                userId,
                employee_number,
                department,
                phone,
                image_url
            ]
        );

        await client.query("COMMIT");

        res.status(201).json({
            success: true,
            message: "Teacher created successfully",
            teacher: teacherResult.rows[0]
        });

    } catch (error) {

        await client.query("ROLLBACK");

        res.status(500).json({
            success: false,
            message: error.message
        });

    } finally {

        client.release();

    }

};



/* =====================================================
GET ALL TEACHERS
===================================================== */

export const getTeachers = async (req, res) => {

    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admin can view teachers"
            });
        }

        const result = await pool.query(
            `SELECT
                t.id AS teacher_id,
                t.employee_number,
                t.department,
                t.phone,
                t.image_url,
                u.name,
                u.email,
                COALESCE(
                    ARRAY_AGG(s.sec_name) FILTER (WHERE s.sec_name IS NOT NULL),
                    '{}'
                ) AS section
            FROM teachers t
            JOIN users u ON t.user_id = u.id
            LEFT JOIN sections s ON s.class_teacher = t.id
            GROUP BY t.id, u.name, u.email
            ORDER BY t.id ASC`
        );

        res.json({
            success: true,
            count: result.rowCount,
            teachers: result.rows
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};



/* =====================================================
GET TEACHER BY ID
===================================================== */

export const getTeacherById = async (req, res) => {

    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admin can view teacher"
            });
        }

        const { id } = req.params;

        const result = await pool.query(
            `SELECT 
                t.id,
                t.employee_number,
                t.department,
                t.phone,
                t.image_url,
                u.name,
                u.email
            FROM teachers t
            JOIN users u ON t.user_id = u.id
            WHERE t.id=$1`,
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found"
            });
        }

        res.json({
            success: true,
            teacher: result.rows[0]
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};



/* =====================================================
GET LOGGED TEACHER
===================================================== */

export const getLoggedTeacher = async (req, res) => {

    try {

        if (req.user.role !== "teacher") {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        const result = await pool.query(
            `SELECT 
                t.id,
                t.employee_number,
                t.department,
                t.phone,
                t.image_url,
                u.name,
                u.email,
                u.role
            FROM teachers t
            JOIN users u ON t.user_id = u.id
            WHERE t.user_id=$1`,
            [req.user.id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found"
            });
        }

        res.json({
            success: true,
            teacher: result.rows[0]
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }

};



/* =====================================================
UPDATE TEACHER
===================================================== */

export const updateTeacher = async (req, res) => {

    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admin can update teacher"
            });
        }

        const { id } = req.params;
        const { employee_number, department, phone, image_url } = req.body;

        const teacher = await pool.query(
            "SELECT * FROM teachers WHERE id=$1",
            [id]
        );

        if (teacher.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found"
            });
        }

        if (employee_number) {

            const duplicate = await pool.query(
                "SELECT id FROM teachers WHERE employee_number=$1 AND id<>$2",
                [employee_number, id]
            );

            if (duplicate.rowCount > 0) {
                return res.status(409).json({
                    success: false,
                    message: "Employee number already exists"
                });
            }

        }

        const result = await pool.query(
            `UPDATE teachers
             SET employee_number=$1,
                 department=$2,
                 phone=$3,
                 image_url=$4
             WHERE id=$5
             RETURNING *`,
            [
                employee_number || teacher.rows[0].employee_number,
                department || teacher.rows[0].department,
                phone || teacher.rows[0].phone,
                image_url || teacher.rows[0].image_url,
                id
            ]
        );

        res.json({
            success: true,
            message: "Teacher updated successfully",
            teacher: result.rows[0]
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }

};



/* =====================================================
DELETE TEACHER
===================================================== */

export const deleteTeacher = async (req, res) => {

    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admin can delete teacher"
            });
        }

        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM teachers WHERE id=$1 RETURNING id",
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found"
            });
        }

        res.json({
            success: true,
            message: "Teacher deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }

};