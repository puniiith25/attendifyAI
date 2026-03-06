import { pool } from "../Database/db.js";

pool

export const createSubject = async (req, res) => {
    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Only admin can create subject" });
        }

        const { name, code, department, semester } = req.body;

        const result = await pool.query(
            `INSERT INTO subjects (name,code,department,semester)
       VALUES ($1,$2,$3,$4)
       RETURNING *`,
            [name, code, department, semester]
        );

        res.json(result.rows[0]);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllSubjects = async (req, res) => {
    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied" });
        }

        const result = await pool.query(
            `SELECT * FROM subjects ORDER BY semester`
        );

        res.json(result.rows);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getTeacherSubjects = async (req, res) => {
    try {

        if (req.user.role !== "teacher") {
            return res.status(403).json({ message: "Access denied" });
        }

        const teacher = await pool.query(
            `SELECT id FROM teachers WHERE user_id=$1`,
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
        sec.name AS section
      FROM teacher_subject_map tsm
      JOIN subjects s ON tsm.subject_id = s.id
      JOIN sections sec ON tsm.section_id = sec.id
      WHERE tsm.teacher_id=$1`,
            [teacher_id]
        );

        res.json(result.rows);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getStudentSubjects = async (req, res) => {
    try {

        if (req.user.role !== "student") {
            return res.status(403).json({ message: "Access denied" });
        }

        const student = await pool.query(
            `SELECT section_id FROM students WHERE user_id=$1`,
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
      JOIN subjects s ON tsm.subject_id = s.id
      WHERE tsm.section_id=$1`,
            [section_id]
        );

        res.json(result.rows);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};