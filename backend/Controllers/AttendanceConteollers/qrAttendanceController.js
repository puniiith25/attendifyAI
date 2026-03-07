import { pool } from "../../Database/db.js";

export const scanQR = async (req, res) => {
    try {

        if (req.user.role !== "student") {
            return res.status(403).json({
                success: false,
                message: "Only students allowed"
            });
        }

        const { qr_token } = req.body;

        if (!qr_token) {
            return res.status(400).json({
                success: false,
                message: "QR token required"
            });
        }


        const student = await pool.query(
            `SELECT id, section_id
       FROM students
       WHERE user_id=$1`,
            [req.user.id]
        );

        if (student.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        const student_id = student.rows[0].id;
        const student_section = student.rows[0].section_id;


        const session = await pool.query(
            `SELECT id, section_id, session_status
       FROM attendance_sessions
       WHERE qr_token=$1`,
            [qr_token]
        );

        if (session.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Invalid QR code"
            });
        }

        const session_id = session.rows[0].id;
        const session_section = session.rows[0].section_id;

        if (session.rows[0].session_status !== "open") {
            return res.status(400).json({
                success: false,
                message: "Attendance session closed"
            });
        }

        /* ==============================
           CHECK SECTION MATCH
        ============================== */

        if (student_section !== session_section) {
            return res.status(403).json({
                success: false,
                message: "You are not in this section"
            });
        }

        /* ==============================
           INSERT ATTENDANCE
        ============================== */

        await pool.query(
            `INSERT INTO attendance_records
       (session_id,student_id,status,method,marked_by)
       VALUES ($1,$2,'present','qr','student')
       ON CONFLICT (session_id,student_id) DO NOTHING`,
            [session_id, student_id]
        );

        res.json({
            success: true,
            message: "Attendance marked successfully"
        });

    } catch (err) {


        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }
};