import { pool } from "../../Database/db.js";

export const scanQR = async (req, res) => {
    try {

        if (req.user.role !== "student") {
            return res.status(403).json({ success: false });
        }

        const { qr_token } = req.body;

        const student = await pool.query(
            "SELECT id FROM students WHERE user_id=$1",
            [req.user.id]
        );

        const student_id = student.rows[0].id;

        const session = await pool.query(
            `SELECT id
            FROM attendance_sessions
            WHERE qr_token=$1
            AND session_status='open'`,
            [qr_token]
        );

        const session_id = session.rows[0].id;

        await pool.query(
            `INSERT INTO attendance_records
            (session_id,student_id,status,method,marked_by)
            VALUES ($1,$2,'present','qr','student')
            ON CONFLICT (session_id,student_id) DO NOTHING`,
            [session_id, student_id]
        );

        res.json({ success: true });

    } catch (err) {
        res.status(500).json({ success: false });
    }
};