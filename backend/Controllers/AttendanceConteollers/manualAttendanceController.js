import { pool } from "../../Database/db.js";

export const markManualAttendance = async (req, res) => {
    try {

        /* ==============================
           ROLE CHECK
        ============================== */

        if (req.user.role !== "teacher") {
            return res.status(403).json({
                success: false,
                message: "Only teachers can mark attendance"
            });
        }

        const { session_id, student_id, status } = req.body;

        if (!session_id || !student_id || !status) {
            return res.status(400).json({
                success: false,
                message: "session_id, student_id and status required"
            });
        }

        if (!["present", "absent"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status"
            });
        }

        /* ==============================
           CHECK SESSION
        ============================== */

        const session = await pool.query(
            `SELECT id, section_id, session_status
             FROM attendance_sessions
             WHERE id=$1`,
            [session_id]
        );

        if (session.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Session not found"
            });
        }

        if (session.rows[0].session_status !== "open") {
            return res.status(400).json({
                success: false,
                message: "Attendance session closed"
            });
        }

        const section_id = session.rows[0].section_id;

        /* ==============================
           CHECK STUDENT
        ============================== */

        const student = await pool.query(
            `SELECT id, section_id
             FROM students
             WHERE id=$1`,
            [student_id]
        );

        if (student.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        if (student.rows[0].section_id !== section_id) {
            return res.status(403).json({
                success: false,
                message: "Student not in this section"
            });
        }

        /* ==============================
           INSERT ATTENDANCE
        ============================== */

        await pool.query(
            `INSERT INTO attendance_records
             (session_id, student_id, status, method, marked_by)
             VALUES ($1,$2,$3,'manual','teacher')
             ON CONFLICT (session_id, student_id)
             DO UPDATE SET status=$3`,
            [session_id, student_id, status]
        );

        res.json({
            success: true,
            message: "Attendance marked successfully"
        });

    } catch (error) {

        console.error("Manual attendance error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }
};