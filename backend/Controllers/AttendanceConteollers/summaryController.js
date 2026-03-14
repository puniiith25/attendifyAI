import { pool } from "../../Database/db.js";

export const getSessionDetails = async (req, res) => {

    try {

        const { id } = req.params;

        const session = await pool.query(
            `SELECT section_id
             FROM attendance_sessions
             WHERE id=$1`,
            [id]
        );

        if (session.rowCount === 0) {

            return res.status(404).json({
                success: false,
                message: "Session not found"
            });

        }

        const section_id = session.rows[0].section_id;

        const result = await pool.query(
            `SELECT 
                s.id,
                u.name,
                s.image_url AS student_photo,

                ar.status,
                ar.method,
                ar.confidence,
                ar.image_url AS capture_image

             FROM students s
             JOIN users u ON s.user_id = u.id

             LEFT JOIN attendance_records ar
             ON ar.student_id = s.id
             AND ar.session_id = $1

             WHERE s.section_id = $2

             ORDER BY s.roll_number`,
            [id, section_id]
        );

        res.json({
            success: true,
            students: result.rows
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false
        });

    }

};