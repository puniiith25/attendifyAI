import { pool } from "../Database/db.js";

export const createTeacher = async (req, res) => {

    const { user_id, employee_number, department, phone } = req.body;

    try {

        if (!user_id || !employee_number || !department || !phone) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const user = await pool.query(
            "SELECT id ,role FROM users WHERE id=$1",
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
                message: "User is not a teacher"
            });
        }
        await pool.query(
            `INSERT INTO teachers (user_id, employee_number, department, phone)
             VALUES ($1,$2,$3,$4)`,
            [user_id, employee_number, department, phone]
        );

        res.status(201).json({
            success: true,
            message: "Teacher Data Inserted Successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const getTeachers = async (req, res) => {
    try {

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

        res.status(200).json({
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

export const getLoggedTeacher = async (req, res) => {

    try {

        const user_id = req.user.id;

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
            WHERE t.user_id = $1`,
            [user_id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found"
            });
        }

        res.status(200).json({
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