import { pool } from "../Database/db.js";

export const startAttendanceSession = async (req, res) => {
    try {

        if (req.user.role !== "teacher") {
            return res.status(403).json({
                success: false,
                message: "Only teachers can start attendance"
            });
        }

        const { section_id, subject_id, period_no, method } = req.body;

        if (!section_id || !subject_id || !period_no || !method) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
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

        const existingSession = await pool.query(
            `SELECT id FROM attendance_sessions
             WHERE section_id=$1
             AND subject_id=$2
             AND period_no=$3
             AND class_date=CURRENT_DATE`,
            [section_id, subject_id, period_no]
        );

        if (existingSession.rowCount > 0) {
            return res.status(409).json({
                success: false,
                message: "Attendance already started for this period"
            });
        }

        const result = await pool.query(
            `INSERT INTO attendance_sessions
            (section_id,subject_id,teacher_id,period_no,method,class_date)
            VALUES ($1,$2,$3,$4,$5,CURRENT_DATE)
            RETURNING *`,
            [section_id, subject_id, teacher_id, period_no, method]
        );

        res.status(201).json({
            success: true,
            session: result.rows[0]
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
};



export const markAttendance = async (req, res) => {
    try {

        const { session_id, student_id, status, confidence } = req.body;

        if (!session_id || !student_id || !status) {
            return res.status(400).json({
                success: false,
                message: "session_id, student_id and status required"
            });
        }

        const student = await pool.query(
            "SELECT id FROM students WHERE id=$1",
            [student_id]
        );

        if (student.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        const duplicate = await pool.query(
            `SELECT id FROM attendance_records
             WHERE session_id=$1 AND student_id=$2`,
            [session_id, student_id]
        );

        if (duplicate.rowCount > 0) {
            return res.status(409).json({
                success: false,
                message: "Attendance already marked"
            });
        }

        const result = await pool.query(
            `INSERT INTO attendance_records
            (session_id,student_id,status,confidence)
            VALUES ($1,$2,$3,$4)
            RETURNING *`,
            [session_id, student_id, status, confidence || null]
        );

        res.status(201).json({
            success: true,
            attendance: result.rows[0]
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
};



export const getAllAttendance = async (req, res) => {
    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        const result = await pool.query(`
            SELECT 
            ar.id,
            u.name AS student_name,
            s.sec_name AS section,
            sub.name AS subject,
            ar.status,
            ar.confidence,
            asn.class_date
            FROM attendance_records ar
            JOIN students st ON ar.student_id = st.id
            JOIN users u ON st.user_id = u.id
            JOIN attendance_sessions asn ON ar.session_id = asn.id
            JOIN sections s ON asn.section_id = s.id
            JOIN subjects sub ON asn.subject_id = sub.id
            ORDER BY asn.class_date DESC
        `);

        res.json({
            success: true,
            count: result.rowCount,
            attendance: result.rows
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
};



export const getTeacherAttendance = async (req, res) => {
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

        const teacher_id = teacher.rows[0].id;

        const result = await pool.query(`
            SELECT 
            ar.id,
            u.name AS student_name,
            s.sec_name AS section,
            sub.name AS subject,
            ar.status,
            ar.confidence,
            asn.class_date
            FROM attendance_records ar
            JOIN students st ON ar.student_id = st.id
            JOIN users u ON st.user_id = u.id
            JOIN attendance_sessions asn ON ar.session_id = asn.id
            JOIN sections s ON asn.section_id = s.id
            JOIN subjects sub ON asn.subject_id = sub.id
            WHERE asn.teacher_id=$1
            ORDER BY asn.class_date DESC
        `, [teacher_id]);

        res.json({
            success: true,
            attendance: result.rows
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
};



export const getStudentAttendance = async (req, res) => {
    try {

        if (req.user.role !== "student") {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        const student = await pool.query(
            "SELECT id FROM students WHERE user_id=$1",
            [req.user.id]
        );

        const student_id = student.rows[0].id;

        const result = await pool.query(`
            SELECT 
            sub.name AS subject,
            ar.status,
            ar.confidence,
            asn.class_date
            FROM attendance_records ar
            JOIN attendance_sessions asn ON ar.session_id = asn.id
            JOIN subjects sub ON asn.subject_id = sub.id
            WHERE ar.student_id=$1
            ORDER BY asn.class_date DESC
        `, [student_id]);

        res.json({
            success: true,
            attendance: result.rows
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
};