import { pool } from "../../Database/db";



export const startAttendanceSession = async (req, res) => {
    try {

        if (req.user.role !== "teacher") {
            return res.status(403).json({ message: "Only teachers can start attendance" });
        }

        const { section_id, subject_id, period_no, method } = req.body;

        const teacher = await pool.query(
            `SELECT id FROM teachers WHERE user_id=$1`,
            [req.user.id]
        );

        const teacher_id = teacher.rows[0].id;

        const result = await pool.query(
            `INSERT INTO attendance_sessions
      (section_id,subject_id,teacher_id,period_no,method,class_date)
      VALUES ($1,$2,$3,$4,$5,CURRENT_DATE)
      RETURNING *`,
            [section_id, subject_id, teacher_id, period_no, method]
        );

        res.json({
            message: "Attendance session started",
            session: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

import pool from "../db/db.js";

export const getTeacherTodayClasses = async (req, res) => {
    try {

        if (req.user.role !== "teacher") {
            return res.status(403).json({ message: "Access denied" });
        }

        const teacher = await pool.query(
            `SELECT id FROM teachers WHERE user_id=$1`,
            [req.user.id]
        );

        const teacher_id = teacher.rows[0].id;

        const result = await pool.query(`
      SELECT
        t.id,
        s.name AS section,
        sub.name AS subject,
        c.room_number AS classroom,
        t.day,
        t.period_no,
        t.start_time,
        t.end_time
      FROM timetable t
      JOIN sections s ON t.section_id = s.id
      JOIN subjects sub ON t.subject_id = sub.id
      JOIN classrooms c ON t.classroom_id = c.id
      WHERE t.teacher_id = $1
      AND t.day = TO_CHAR(CURRENT_DATE, 'Day')
      ORDER BY t.period_no
    `, [teacher_id]);

        res.json(result.rows);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};