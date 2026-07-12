import { pool } from "../Database/db.js";



export const getAdminDashboard = async (req, res) => {
    try {
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
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
}

export const getTeacherDashboard = async (req, res) => {
    try {
        if (req.user.role !== "teacher") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Teacher only."
            });
        }

        const teacherRes = await pool.query(
            "SELECT id FROM teachers WHERE user_id = $1",
            [req.user.id]
        );

        if (teacherRes.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found"
            });
        }

        const teacher_id = teacherRes.rows[0].id;

        // 1. Total Timetable classes
        const classes = await pool.query(
            "SELECT COUNT(*) FROM timetable WHERE teacher_id = $1",
            [teacher_id]
        );

        // 2. Total Sessions conducted
        const sessions = await pool.query(
            "SELECT COUNT(*) FROM attendance_sessions WHERE teacher_id = $1",
            [teacher_id]
        );

        // 3. Average Attendance rate
        const avgAttendance = await pool.query(
            `SELECT 
                COALESCE(AVG(present_ratio), 0) * 100 AS avg_attendance
             FROM (
                SELECT 
                    asess.id,
                    (SELECT COUNT(*)::float FROM attendance_records WHERE session_id = asess.id AND status = 'present') / 
                    NULLIF((SELECT COUNT(*)::float FROM students WHERE section_id = asess.section_id), 0) AS present_ratio
                FROM attendance_sessions asess
                WHERE asess.teacher_id = $1
             ) subquery`,
            [teacher_id]
        );

        // 4. Recent Sessions conducted
        const recentSessions = await pool.query(
            `SELECT 
                asess.id,
                asess.class_date,
                asess.period_no,
                asess.session_status,
                sub.name AS subject_name,
                sec.sec_name AS section_name,
                (SELECT COUNT(*)::int FROM attendance_records WHERE session_id = asess.id AND status = 'present') AS present_count,
                (SELECT COUNT(*)::int FROM students WHERE section_id = asess.section_id) AS total_count
             FROM attendance_sessions asess
             JOIN subjects sub ON asess.subject_id = sub.id
             JOIN sections sec ON asess.section_id = sec.id
             WHERE asess.teacher_id = $1
             ORDER BY asess.created_at DESC
             LIMIT 5`,
            [teacher_id]
        );

        res.json({
            success: true,
            totalClasses: parseInt(classes.rows[0].count),
            totalSessions: parseInt(sessions.rows[0].count),
            avgAttendance: Math.round(parseFloat(avgAttendance.rows[0].avg_attendance || 0)),
            recentSessions: recentSessions.rows[0] ? recentSessions.rows : []
        });

    } catch (err) {
        console.error("getTeacherDashboard error:", err);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};