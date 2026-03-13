import { pool } from "../../Database/db.js";
import crypto from "crypto";
import QRCode from "qrcode";

/* =========================================
START ATTENDANCE SESSION
========================================= */

export const startAttendanceSession = async (req, res) => {

    try {

        /* ==============================
        ROLE CHECK
        ============================== */

        if (req.user.role !== "teacher") {
            return res.status(403).json({
                success: false,
                message: "Only teachers can start attendance"
            });
        }

        const { method } = req.body;

        const allowed = ["face", "qr", "manual"];

        if (!allowed.includes(method)) {
            return res.status(400).json({
                success: false,
                message: "Invalid attendance method"
            });
        }

        /* ==============================
        GET TEACHER
        ============================== */

        const teacher = await pool.query(
            "SELECT id FROM teachers WHERE user_id=$1",
            [req.user.id]
        );

        if (teacher.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found"
            });
        }

        const teacher_id = teacher.rows[0].id;

        /* ==============================
        CURRENT INDIA TIME
        ============================== */

        const indiaTime = new Date(
            new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
        );

        const day = indiaTime.toLocaleDateString("en-US", {
            weekday: "long"
        });

        const time = indiaTime.toLocaleTimeString("en-GB", {
            hour12: false
        });

        console.log("Teacher:", teacher_id);
        console.log("Day:", day);
        console.log("Current Time:", time);

        /* ==============================
        FIND CURRENT CLASS
        ============================== */

        const timetable = await pool.query(
            `SELECT *
             FROM timetable
             WHERE teacher_id=$1
             AND LOWER(day)=LOWER($2)
             AND start_time <= $3::time
             AND end_time >= $3::time`,
            [teacher_id, day, time]
        );

        if (timetable.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "No class scheduled right now",
                day,
                time
            });
        }

        const row = timetable.rows[0];

        /* ==============================
        PREVENT MULTIPLE SESSIONS
        ============================== */

        const active = await pool.query(
            `SELECT id
             FROM attendance_sessions
             WHERE teacher_id=$1
             AND session_status='open'`,
            [teacher_id]
        );

        if (active.rowCount > 0) {
            return res.status(409).json({
                success: false,
                message: "Attendance session already running"
            });
        }

        /* ==============================
        QR TOKEN
        ============================== */

        let qr_token = null;
        let qr_image = null;

        if (method === "qr") {
            qr_token = crypto.randomBytes(16).toString("hex");
        }

        /* ==============================
        CREATE SESSION
        ============================== */

        const session = await pool.query(
            `INSERT INTO attendance_sessions
            (section_id, subject_id, teacher_id, period_no, method, class_date, qr_token, session_status)
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

        /* ==============================
        GENERATE QR IMAGE
        ============================== */

        if (method === "qr") {
            qr_image = await QRCode.toDataURL(qr_token);
        }

        /* ==============================
        RESPONSE
        ============================== */

        res.status(201).json({
            success: true,
            message: "Attendance session started",
            session: session.rows[0],
            qr_token,
            qr_image
        });

    } catch (err) {

        console.error("Start session error:", err);

        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }

};
/* =========================================
CLOSE ATTENDANCE SESSION
========================================= */

export const closeAttendanceSession = async (req, res) => {

    try {

        if (req.user.role !== "teacher") {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        const { id } = req.params;

        const result = await pool.query(
            `UPDATE attendance_sessions
       SET session_status='closed'
       WHERE id=$1
       RETURNING id`,
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Session not found"
            });
        }

        res.json({
            success: true,
            message: "Attendance session closed"
        });

    } catch (err) {

        console.error("Close session error:", err);

        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }
};


export const getSessionStudents = async (req, res) => {
    try {

        const { session_id } = req.params

        const session = await pool.query(
            `SELECT section_id
       FROM attendance_sessions
       WHERE id=$1`,
            [session_id]
        )

        const section_id = session.rows[0].section_id

        const students = await pool.query(
            `SELECT id,name,photo_url
       FROM students
       WHERE section_id=$1`,
            [section_id]
        )

        res.json({
            success: true,
            students: students.rows
        })

    } catch (err) {
        res.status(500).json({ success: false })
    }
}