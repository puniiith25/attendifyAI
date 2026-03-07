import { pool } from "../../Database/db.js";
import crypto from "crypto";

export const startAttendanceSession = async (req, res) => {
    try {

        if (req.user.role !== "teacher") {
            return res.status(403).json({ success: false, message: "Only teacher allowed" });
        }

        const { method } = req.body;

        if (!["face", "qr", "manual"].includes(method)) {
            return res.status(400).json({ success: false, message: "Invalid method" });
        }

        const teacher = await pool.query(
            "SELECT id FROM teachers WHERE user_id=$1",
            [req.user.id]
        );

        const teacher_id = teacher.rows[0].id;

        const now = new Date();
        const day = now.toLocaleDateString("en-US", { weekday: "long" });
        const time = now.toTimeString().slice(0, 5);

        const timetable = await pool.query(
            `SELECT * FROM timetable
            WHERE teacher_id=$1
            AND day=$2
            AND start_time <= $3
            AND end_time >= $3`,
            [teacher_id, day, time]
        );

        if (timetable.rowCount === 0) {
            return res.status(404).json({ success: false, message: "No class now" });
        }

        const row = timetable.rows[0];

        let qr_token = null;

        if (method === "qr") {
            qr_token = crypto.randomBytes(8).toString("hex");
        }

        const session = await pool.query(
            `INSERT INTO attendance_sessions
            (section_id,subject_id,teacher_id,period_no,method,class_date,qr_token,session_status)
            VALUES ($1,$2,$3,$4,$5,CURRENT_DATE,$6,'open')
            RETURNING *`,
            [
                row.section_id,
                row.subject_id,
                teacher_id,
                row.period_no,
                method,
                qr_token
            ]
        );

        res.status(201).json({ success: true, session: session.rows[0] });

    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};



export const closeAttendanceSession = async (req, res) => {
    try {

        if (req.user.role !== "teacher") {
            return res.status(403).json({ success: false, message: "Access denied" });
        }

        const { id } = req.params;

        await pool.query(
            `UPDATE attendance_sessions
            SET session_status='closed'
            WHERE id=$1`,
            [id]
        );

        res.json({ success: true, message: "Session closed" });

    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};