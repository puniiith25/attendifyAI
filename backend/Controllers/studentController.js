import { pool } from "../Database/db.js";

export const createStudent = async (req, res) => {

    const {
        user_id,
        roll_number,
        section_id,
        department,
        semester,
        phone,
        admission_year
    } = req.body;

    try {

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
                message: "User is not a student"
            });
        }

        await pool.query(
            `INSERT INTO students
            (user_id, roll_number, section_id, department, semester, phone, admission_year)
            VALUES ($1,$2,$3,$4,$5,$6,$7)`,
            [
                user_id,
                roll_number,
                section_id,
                department,
                semester,
                phone,
                admission_year
            ]
        );

        res.status(201).json({
            success: true,
            message: "Student Data Inserted Successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


export const getStudents = async (req, res) => {

    try {

        const result = await pool.query(
            `SELECT 
                s.id AS student_id,
                s.roll_number,
                s.department,
                s.semester,
                s.phone,
                s.admission_year,
                sec.sec_name AS section,
                u.name,
                u.email
            FROM students s
            JOIN users u ON s.user_id = u.id
            JOIN sections sec ON s.section_id = sec.id
            ORDER BY s.id ASC`
        );

        res.status(200).json({
            success: true,
            count: result.rowCount,
            students: result.rows
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


export const getLoggedStudent = async (req, res) => {

    try {

        const user_id = req.user.id;

        const result = await pool.query(
            `SELECT 
                s.id,
                s.roll_number,
                s.department,
                s.semester,
                s.phone,
                s.admission_year,
                sec.sec_name AS section,
                u.name,
                u.email,
                u.role
            FROM students s
            JOIN users u ON s.user_id = u.id
            JOIN sections sec ON s.section_id = sec.id
            WHERE s.user_id = $1`,
            [user_id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.status(200).json({
            success: true,
            student: result.rows[0]
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};