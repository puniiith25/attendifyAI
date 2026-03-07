import { pool } from "../../Database/db.js";
import { supabase } from "../../config/supabase.js";

export const createStudent = async (req, res) => {
    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admin can create student"
            });
        }

        const {
            user_id,
            roll_number,
            section_id,
            department,
            semester,
            phone,
            admission_year
        } = req.body;

        if (!user_id || !roll_number || !section_id || !department || !semester || !phone || !admission_year) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const user = await pool.query(
            "SELECT id, role FROM users WHERE id=$1",
            [user_id]
        );

        if (user.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.rows[0].role !== "student") {
            return res.status(400).json({
                success: false,
                message: "User role must be student"
            });
        }

        const section = await pool.query(
            "SELECT id FROM sections WHERE id=$1",
            [section_id]
        );

        if (section.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Section not found"
            });
        }

        const duplicate = await pool.query(
            "SELECT id FROM students WHERE roll_number=$1",
            [roll_number]
        );

        if (duplicate.rowCount > 0) {
            return res.status(409).json({
                success: false,
                message: "Roll number already exists"
            });
        }

        let image_url = null;

        if (req.file) {

            const fileName = `student_${roll_number}_${Date.now()}.jpg`;

            const { error } = await supabase.storage
                .from("student-faces")
                .upload(fileName, req.file.buffer, {
                    contentType: req.file.mimetype
                });

            if (error) {
                return res.status(500).json({
                    success: false,
                    message: "Image upload failed"
                });
            }

            const { data } = supabase.storage
                .from("student-faces")
                .getPublicUrl(fileName);

            image_url = data.publicUrl;

        }

        const result = await pool.query(
            `INSERT INTO students
            (user_id, roll_number, section_id, department, semester, phone, admission_year, image_url)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
            RETURNING *`,
            [
                user_id,
                roll_number,
                section_id,
                department,
                semester,
                phone,
                admission_year,
                image_url
            ]
        );

        res.status(201).json({
            success: true,
            message: "Student created successfully",
            student: result.rows[0]
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
};


export const getStudents = async (req, res) => {
    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admin can view students"
            });
        }

        const result = await pool.query(
            `SELECT 
                s.id AS student_id,
                s.roll_number,
                s.department,
                s.semester,
                s.phone,
                s.admission_year,
                s.image_url,
                sec.sec_name AS section,
                u.name,
                u.email
            FROM students s
            JOIN users u ON s.user_id = u.id
            JOIN sections sec ON s.section_id = sec.id
            ORDER BY s.id ASC`
        );

        res.json({
            success: true,
            count: result.rowCount,
            students: result.rows
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
};


export const getStudentById = async (req, res) => {
    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admin can view student"
            });
        }

        const { id } = req.params;

        const result = await pool.query(
            `SELECT 
    s.id,
    s.roll_number,
    s.department,
    s.semester,
    s.phone,
    s.admission_year,
    s.image_url,
    sec.sec_name AS section,
    u.name,
    u.email
FROM students s
JOIN users u ON s.user_id = u.id
JOIN sections sec ON s.section_id = sec.id
WHERE s.id=$1`,
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.json({
            success: true,
            student: result.rows[0]
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
};


export const getLoggedStudent = async (req, res) => {
    try {

        if (req.user.role !== "student") {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        const result = await pool.query(
            `SELECT 
    s.id,
    s.roll_number,
    s.department,
    s.semester,
    s.phone,
    s.admission_year,
    s.image_url,
    sec.sec_name AS section,
    u.name,
    u.email,
    u.role
FROM students s
JOIN users u ON s.user_id = u.id
JOIN sections sec ON s.section_id = sec.id
WHERE s.user_id=$1`,
            [req.user.id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.json({
            success: true,
            student: result.rows[0]
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
};


export const updateStudent = async (req, res) => {
    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admin can update student"
            });
        }

        const { id } = req.params;

        const {
            roll_number,
            section_id,
            department,
            semester,
            phone,
            admission_year
        } = req.body;

        const student = await pool.query(
            "SELECT * FROM students WHERE id=$1",
            [id]
        );

        if (student.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        if (roll_number) {

            const duplicate = await pool.query(
                "SELECT id FROM students WHERE roll_number=$1 AND id<>$2",
                [roll_number, id]
            );

            if (duplicate.rowCount > 0) {
                return res.status(409).json({
                    success: false,
                    message: "Roll number already exists"
                });
            }

        }

        let image_url = student.rows[0].image_url;

        if (req.file) {

            const fileName = `student_${id}_${Date.now()}.jpg`;

            const { error } = await supabase.storage
                .from("student-faces")
                .upload(fileName, req.file.buffer, {
                    contentType: req.file.mimetype
                });

            if (error) {
                return res.status(500).json({
                    success: false,
                    message: "Image upload failed"
                });
            }

            const { data } = supabase.storage
                .from("student-faces")
                .getPublicUrl(fileName);

            image_url = data.publicUrl;

        }

        const result = await pool.query(
            `UPDATE students
             SET roll_number=$1,
                 section_id=$2,
                 department=$3,
                 semester=$4,
                 phone=$5,
                 admission_year=$6,
                 image_url=$7
             WHERE id=$8
             RETURNING *`,
            [
                roll_number || student.rows[0].roll_number,
                section_id || student.rows[0].section_id,
                department || student.rows[0].department,
                semester || student.rows[0].semester,
                phone || student.rows[0].phone,
                admission_year || student.rows[0].admission_year,
                image_url,
                id
            ]
        );

        res.json({
            success: true,
            message: "Student updated successfully",
            student: result.rows[0]
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
};


export const deleteStudent = async (req, res) => {
    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admin can delete student"
            });
        }

        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM students WHERE id=$1 RETURNING id",
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.json({
            success: true,
            message: "Student deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
};