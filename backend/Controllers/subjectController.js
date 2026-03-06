import { pool } from "../Database/db.js";

export const createSubject = async (req, res) => {
    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admin can create subject"
            });
        }

        const { name, code, department, semester } = req.body;

        if (!name || !code || !department || !semester) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const duplicate = await pool.query(
            "SELECT id FROM subjects WHERE code=$1",
            [code]
        );

        if (duplicate.rowCount > 0) {
            return res.status(409).json({
                success: false,
                message: "Subject code already exists"
            });
        }

        const result = await pool.query(
            `INSERT INTO subjects (name, code, department, semester)
             VALUES ($1,$2,$3,$4)
             RETURNING *`,
            [name, code, department, semester]
        );

        res.status(201).json({
            success: true,
            subject: result.rows[0]
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
};


export const getAllSubjects = async (req, res) => {
    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        const result = await pool.query(
            "SELECT * FROM subjects ORDER BY semester"
        );

        res.json({
            success: true,
            count: result.rowCount,
            subjects: result.rows
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
};


export const getSubjectById = async (req, res) => {
    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        const { id } = req.params;

        const result = await pool.query(
            "SELECT * FROM subjects WHERE id=$1",
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Subject not found"
            });
        }

        res.json({
            success: true,
            subject: result.rows[0]
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
};


export const updateSubject = async (req, res) => {
    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admin can update subject"
            });
        }

        const { id } = req.params;
        const { name, code, department, semester } = req.body;

        const subject = await pool.query(
            "SELECT * FROM subjects WHERE id=$1",
            [id]
        );

        if (subject.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Subject not found"
            });
        }

        if (code) {
            const duplicate = await pool.query(
                "SELECT id FROM subjects WHERE code=$1 AND id<>$2",
                [code, id]
            );

            if (duplicate.rowCount > 0) {
                return res.status(409).json({
                    success: false,
                    message: "Subject code already exists"
                });
            }
        }

        const result = await pool.query(
            `UPDATE subjects
             SET name=$1,
                 code=$2,
                 department=$3,
                 semester=$4
             WHERE id=$5
             RETURNING *`,
            [
                name || subject.rows[0].name,
                code || subject.rows[0].code,
                department || subject.rows[0].department,
                semester || subject.rows[0].semester,
                id
            ]
        );

        res.json({
            success: true,
            message: "Subject updated successfully",
            subject: result.rows[0]
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
};


export const deleteSubject = async (req, res) => {
    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admin can delete subject"
            });
        }

        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM subjects WHERE id=$1 RETURNING id",
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Subject not found"
            });
        }

        res.json({
            success: true,
            message: "Subject deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
};


export const getTeacherSubjects = async (req, res) => {
    try {

        if (req.user.role !== "teacher") {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        const teacher = await pool.query(
            "SELECT id FROM teachers WHERE user_id=$1",
            [req.user.id]
        );

        const teacher_id = teacher.rows[0].id;

        const result = await pool.query(
            `SELECT 
                s.id,
                s.name,
                s.code,
                s.department,
                s.semester,
                sec.sec_name AS section
             FROM teacher_subject_map tsm
             JOIN subjects s ON tsm.subject_id=s.id
             JOIN sections sec ON tsm.section_id=sec.id
             WHERE tsm.teacher_id=$1`,
            [teacher_id]
        );

        res.json({
            success: true,
            subjects: result.rows
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
};


export const getStudentSubjects = async (req, res) => {
    try {

        if (req.user.role !== "student") {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        const student = await pool.query(
            "SELECT section_id FROM students WHERE user_id=$1",
            [req.user.id]
        );

        const section_id = student.rows[0].section_id;

        const result = await pool.query(
            `SELECT 
                s.id,
                s.name,
                s.code,
                s.department,
                s.semester
             FROM teacher_subject_map tsm
             JOIN subjects s ON tsm.subject_id=s.id
             WHERE tsm.section_id=$1`,
            [section_id]
        );

        res.json({
            success: true,
            subjects: result.rows
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
};