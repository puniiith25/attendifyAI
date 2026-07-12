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

        const { method, section_id, subject_id, period_no } = req.body;

        const allowed = ["face", "manual"];

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
        RESOLVE TIMETABLE SLOT OR TIME-LOOKUP
        ============================== */

        let row;

        if (section_id && subject_id && period_no) {
            row = {
                section_id: parseInt(section_id),
                subject_id: parseInt(subject_id),
                period_no: parseInt(period_no)
            };
        } else {
            const indiaTime = new Date(
                new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
            );

            const dayNumber = indiaTime.getDay(); // 0 = Sunday, 6 = Saturday

            const time = indiaTime.toLocaleTimeString("en-GB", {
                hour12: false
            });

            console.log("Teacher:", teacher_id);
            console.log("Day Number:", dayNumber);
            console.log("Current Time:", time);

            const timetable = await pool.query(
                `SELECT *
                 FROM timetable
                 WHERE teacher_id=$1
                 AND day_of_week=$2
                 AND start_time <= $3::time
                 AND end_time >= $3::time`,
                [teacher_id, dayNumber, time]
            );

            if (timetable.rowCount === 0) {
                return res.status(404).json({
                    success: false,
                    message: "No class scheduled right now",
                    dayNumber,
                    time
                });
            }

            row = timetable.rows[0];
        }

        /* ==============================
        PREVENT MULTIPLE SESSIONS
        ============================== */

        const active = await pool.query(
            `SELECT *
             FROM attendance_sessions
             WHERE teacher_id=$1
             AND session_status='open'`,
            [teacher_id]
        );

        if (active.rowCount > 0) {
            const activeSession = active.rows[0];
            if (
                activeSession.section_id === row.section_id &&
                activeSession.subject_id === row.subject_id &&
                activeSession.period_no === row.period_no
            ) {
                return res.status(200).json({
                    success: true,
                    message: "Resuming attendance session",
                    session: activeSession
                });
            }

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
        CREATE OR REUSE SESSION
        ============================= */

        let sessionRow;

        const existing = await pool.query(
            `SELECT * FROM attendance_sessions
             WHERE section_id = $1
             AND subject_id = $2
             AND teacher_id = $3
             AND period_no = $4
             AND class_date = CURRENT_DATE
             ORDER BY id DESC
             LIMIT 1`,
            [row.section_id, row.subject_id, teacher_id, row.period_no]
        );

        if (existing.rowCount > 0) {
            // Reopen the existing session for today
            const reopened = await pool.query(
                `UPDATE attendance_sessions
                 SET session_status = 'open', method = $1
                 WHERE id = $2
                 RETURNING *`,
                [method, existing.rows[0].id]
            );
            sessionRow = reopened.rows[0];
        } else {
            // Create a brand new session
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
            sessionRow = session.rows[0];
        }

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
            session: sessionRow,
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


/* =========================================
GET SESSION STUDENTS
========================================= */

export const getSessionStudents = async (req, res) => {

    try {

        const { session_id } = req.params;

        const session = await pool.query(
            `SELECT section_id
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

        const section_id = session.rows[0].section_id;

        const students = await pool.query(
            `SELECT 
                s.id,
                u.name,
                s.image_url
             FROM students s
             JOIN users u ON s.user_id = u.id
             WHERE s.section_id=$1`,
            [section_id]
        );

        res.json({
            success: true,
            students: students.rows
        });

    } catch (err) {

        console.error("Get session students error:", err);

        res.status(500).json({
            success: false
        });

    }

};

export const submitAttendance = async (req, res) => {

    try {

        const { session_id } = req.body

        await pool.query(
            `UPDATE attendance_sessions
         SET session_status='closed'
         WHERE id=$1`,
            [session_id])

        res.json({
            success: true,
            message: "Attendance submitted"
        })

    } catch (err) {

        console.error(err)

        res.status(500).json({
            success: false
        })

    }

}

export const getActiveSession = async (req, res) => {
    try {
        if (req.user.role !== "teacher") {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

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

        const active = await pool.query(
            `SELECT asess.id, asess.section_id, asess.subject_id, asess.period_no, asess.method, asess.class_date, asess.session_status,
                    s.sec_name AS section, sub.name AS subject
             FROM attendance_sessions asess
             JOIN sections s ON asess.section_id = s.id
             JOIN subjects sub ON asess.subject_id = sub.id
             WHERE asess.teacher_id=$1
             AND asess.session_status='open'
             LIMIT 1`,
            [teacher_id]
        );

        if (active.rowCount === 0) {
            return res.json({
                success: true,
                active: false
            });
        }

        res.json({
            success: true,
            active: true,
            session: active.rows[0]
        });

    } catch (err) {
        console.error("getActiveSession error:", err);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const getSessionsHistory = async (req, res) => {
    try {
        if (req.user.role !== "teacher") {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

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

        const history = await pool.query(
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
             ORDER BY asess.class_date DESC, asess.created_at DESC`,
            [teacher_id]
        );

        res.json({
            success: true,
            sessions: history.rows
        });

    } catch (err) {
        console.error("getSessionsHistory error:", err);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

