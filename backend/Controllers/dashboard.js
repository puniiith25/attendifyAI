import { pool } from "../Database/db.js";



export const getAdminDashboard = async (req, res) => {
    const students = await pool.query("SELECT COUNT(*) FROM students");
    const teachers = await pool.query("SELECT COUNT(*) FROM teachers");
    const sections = await pool.query("SELECT COUNT(*) FROM sections");
    const sessions = await pool.query("SELECT COUNT(*) FROM attendance_sessions");

    res.json({
        students: students.rows[0].count,
        teachers: teachers.rows[0].count,
        sections: sections.rows[0].count,
        sessions: sessions.rows[0].count
    });
}