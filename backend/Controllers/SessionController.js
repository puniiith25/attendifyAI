// import { pool } from "../Database/db.js";
// import crypto from "crypto";


// export const startAttendanceSession = async (req, res) => {
//     try {

//         if (req.user.role !== "teacher") {
//             return res.status(403).json({ success: false, message: "Only teacher allowed" });
//         }

//         const { method } = req.body;

//         if (!["face", "qr", "manual"].includes(method)) {
//             return res.status(400).json({ success: false, message: "Invalid method" });
//         }

//         const teacher = await pool.query(
//             "SELECT id FROM teachers WHERE user_id=$1",
//             [req.user.id]
//         );

//         if (teacher.rowCount === 0) {
//             return res.status(404).json({ success: false, message: "Teacher not found" });
//         }

//         const teacher_id = teacher.rows[0].id;

//         const now = new Date();
//         const day = now.toLocaleDateString("en-US", { weekday: "long" });
//         const time = now.toTimeString().slice(0, 5);

//         const timetable = await pool.query(

//             `SELECT *
// FROM timetable
// WHERE teacher_id=$1
// AND day=$2
// AND start_time <= $3
// AND end_time >= $3`,

//             [teacher_id, day, time]

//         );

//         if (timetable.rowCount === 0) {
//             return res.status(404).json({ success: false, message: "No class now" });
//         }

//         const row = timetable.rows[0];

//         const existing = await pool.query(

//             `SELECT id FROM attendance_sessions
// WHERE teacher_id=$1
// AND period_no=$2
// AND class_date=CURRENT_DATE`,

//             [teacher_id, row.period_no]

//         );

//         if (existing.rowCount > 0) {
//             return res.status(409).json({ success: false, message: "Session already started" });
//         }

//         let qr_token = null;

//         if (method === "qr") {
//             qr_token = crypto.randomBytes(8).toString("hex");
//         }

//         const session = await pool.query(

//             `INSERT INTO attendance_sessions
// (section_id,subject_id,teacher_id,period_no,method,class_date,qr_token,session_status)
// VALUES ($1,$2,$3,$4,$5,CURRENT_DATE,$6,'open')
// RETURNING *`,

//             [
//                 row.section_id,
//                 row.subject_id,
//                 teacher_id,
//                 row.period_no,
//                 method,
//                 qr_token
//             ]

//         );

//         res.status(201).json({ success: true, session: session.rows[0] });

//     } catch (err) {

//         res.status(500).json({ success: false, message: "Server error" });

//     }
// };



// export const markManualAttendance = async (req, res) => {
//     try {

//         if (req.user.role !== "teacher") {
//             return res.status(403).json({ success: false, message: "Access denied" });
//         }

//         const { session_id, student_id, status } = req.body;

//         if (!session_id || !student_id || !status) {
//             return res.status(400).json({ success: false, message: "Missing fields" });
//         }

//         await pool.query(

//             `INSERT INTO attendance_records
// (session_id,student_id,status,method,marked_by)
// VALUES ($1,$2,$3,'manual','teacher')
// ON CONFLICT (session_id,student_id) DO NOTHING`,

//             [session_id, student_id, status]

//         );

//         res.json({ success: true, message: "Attendance marked" });

//     } catch (err) {

//         res.status(500).json({ success: false, message: "Server error" });

//     }
// };



// export const markFaceAttendance = async (req, res) => {
//     try {

//         const { session_id, students } = req.body;

//         if (!session_id || !students) {
//             return res.status(400).json({ success: false, message: "Invalid data" });
//         }

//         for (const s of students) {

//             await pool.query(

//                 `INSERT INTO attendance_records
// (session_id,student_id,status,confidence,method,marked_by)
// VALUES ($1,$2,$3,$4,'face','ai')
// ON CONFLICT (session_id,student_id) DO NOTHING`,

//                 [
//                     session_id,
//                     s.student_id,
//                     s.status || "present",
//                     s.confidence
//                 ]

//             );

//         }

//         res.json({ success: true, message: "Face attendance stored" });

//     } catch (err) {

//         res.status(500).json({ success: false, message: "Server error" });

//     }
// };


// export const scanQR = async (req, res) => {
//     try {

//         if (req.user.role !== "student") {
//             return res.status(403).json({ success: false, message: "Only students allowed" });
//         }

//         const { qr_token } = req.body;

//         if (!qr_token) {
//             return res.status(400).json({ success: false, message: "QR token required" });
//         }

//         const student = await pool.query(
//             "SELECT id FROM students WHERE user_id=$1",
//             [req.user.id]
//         );

//         const student_id = student.rows[0].id;

//         const session = await pool.query(

//             `SELECT id
// FROM attendance_sessions
// WHERE qr_token=$1
// AND session_status='open'`,

//             [qr_token]

//         );

//         if (session.rowCount === 0) {
//             return res.status(400).json({ success: false, message: "Invalid QR" });
//         }

//         const session_id = session.rows[0].id;

//         await pool.query(

//             `INSERT INTO attendance_records
// (session_id,student_id,status,method,marked_by)
// VALUES ($1,$2,'present','qr','student')
// ON CONFLICT (session_id,student_id) DO NOTHING`,

//             [session_id, student_id]

//         );

//         res.json({ success: true, message: "Attendance marked" });

//     } catch (err) {

//         res.status(500).json({ success: false, message: "Server error" });

//     }
// };



// export const closeAttendanceSession = async (req, res) => {
//     try {

//         if (req.user.role !== "teacher") {
//             return res.status(403).json({ success: false, message: "Access denied" });
//         }

//         const { id } = req.params;

//         await pool.query(
//             `UPDATE attendance_sessions
// SET session_status='closed'
// WHERE id=$1`,
//             [id]
//         );

//         res.json({ success: true, message: "Session closed" });

//     } catch (err) {

//         res.status(500).json({ success: false, message: "Server error" });

//     }
// };



// export const getSessionSummary = async (req, res) => {
//     try {

//         const { id } = req.params;

//         const result = await pool.query(

//             `SELECT
// COUNT(*) FILTER (WHERE status='present') AS present,
// COUNT(*) FILTER (WHERE status='absent') AS absent,
// COUNT(*) AS total
// FROM attendance_records
// WHERE session_id=$1`,

//             [id]

//         );

//         res.json({ success: true, summary: result.rows[0] });

//     } catch (err) {

//         res.status(500).json({ success: false, message: "Server error" });

//     }
// };