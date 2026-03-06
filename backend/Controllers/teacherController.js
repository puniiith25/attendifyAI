import { pool } from "../Database/db.js";

export const createTeacher = async (req, res) => {
    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admin can create teacher"
            });
        }

        const { user_id, employee_number, department, phone } = req.body;

        if (!user_id || !employee_number || !department || !phone) {
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

        if (user.rows[0].role !== "teacher") {
            return res.status(400).json({
                success: false,
                message: "User role must be teacher"
            });
        }

        const duplicate = await pool.query(
            "SELECT id FROM teachers WHERE employee_number=$1",
            [employee_number]
        );

        if (duplicate.rowCount > 0) {
            return res.status(409).json({
                success: false,
                message: "Employee number already exists"
            });
        }

        const result = await pool.query(
            `INSERT INTO teachers (user_id, employee_number, department, phone)
             VALUES ($1,$2,$3,$4)
             RETURNING *`,
            [user_id, employee_number, department, phone]
        );

        res.status(201).json({
            success: true,
            message: "Teacher created successfully",
            teacher: result.rows[0]
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
};



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
                u.name,
                u.email
            FROM teachers t
            JOIN users u ON t.user_id = u.id
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
            message: "Internal server error"
        });

    }
};



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
            message: "Internal server error"
        });

    }
};



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



export const updateTeacher = async (req, res) => {
    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admin can update teacher"
            });
        }

        const { id } = req.params;
        const { employee_number, department, phone } = req.body;

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
                 phone=$3
             WHERE id=$4
             RETURNING *`,
            [
                employee_number || teacher.rows[0].employee_number,
                department || teacher.rows[0].department,
                phone || teacher.rows[0].phone,
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