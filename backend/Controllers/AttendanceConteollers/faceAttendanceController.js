import { pool } from "../../Database/db.js";

export const markFaceAttendance = async (req, res) => {
    try {

        const { session_id, students } = req.body;

        for (const s of students) {

            await pool.query(
                `INSERT INTO attendance_records
                (session_id,student_id,status,confidence,method,marked_by)
                VALUES ($1,$2,$3,$4,'face','ai')
                ON CONFLICT (session_id,student_id) DO NOTHING`,
                [
                    session_id,
                    s.student_id,
                    s.status || "present",
                    s.confidence
                ]
            );

        }

        res.json({ success: true });

    } catch (err) {
        res.status(500).json({ success: false });
    }
};