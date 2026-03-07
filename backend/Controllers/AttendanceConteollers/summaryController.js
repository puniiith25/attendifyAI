import { pool } from "../../Database/db.js";

export const getSessionSummary = async (req, res) => {
    try {

        const { id } = req.params;

        const result = await pool.query(
            `SELECT
            COUNT(*) FILTER (WHERE status='present') AS present,
            COUNT(*) FILTER (WHERE status='absent') AS absent,
            COUNT(*) AS total
            FROM attendance_records
            WHERE session_id=$1`,
            [id]
        );

        res.json({ success: true, summary: result.rows[0] });

    } catch (err) {
        res.status(500).json({ success: false });
    }
};