import { pool } from "../../Database/db.js";

export const markManualAttendance = async (req, res) => {
    try {

        if (req.user.role !== "teacher") {
            return res.status(403).json({ success: false, message: "Access denied" });
        }

        const { session_id, student_id, status } = req.body;

        await pool.query(
            `INSERT INTO attendance_records
            (session_id,student_id,status,method,marked_by)
            VALUES ($1,$2,$3,'manual','teacher')
            ON CONFLICT (session_id,student_id) DO NOTHING`,
            [session_id, student_id, status]
        );

        res.json({ success: true });

    } catch (err) {
        res.status(500).json({ success: false });
    }
};