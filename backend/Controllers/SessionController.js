import { pool } from "../Database/db.js";



export const startAttendanceSession = async (req, res) => {
    try {

        if (req.user.role !== "teacher") {
            return res.status(403).json({ message: "Only teachers can start attendance" });
        }

        const { section_id, subject_id, period_no, method } = req.body;

        const teacher = await pool.query(
            `SELECT id FROM teachers WHERE user_id=$1`,
            [req.user.id]
        );

        const teacher_id = teacher.rows[0].id;

        const result = await pool.query(
            `INSERT INTO attendance_sessions
      (section_id,subject_id,teacher_id,period_no,method,class_date)
      VALUES ($1,$2,$3,$4,$5,CURRENT_DATE)
      RETURNING *`,
            [section_id, subject_id, teacher_id, period_no, method]
        );

        res.json({
            message: "Attendance session started",
            session: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const getTeacherTodayClasses = async (req, res) => {
    try {

        if (req.user.role !== "teacher") {
            return res.status(403).json({ message: "Access denied" });
        }

        const teacher = await pool.query(
            `SELECT id FROM teachers WHERE user_id=$1`,
            [req.user.id]
        );

        const teacher_id = teacher.rows[0].id;

        const result = await pool.query(`
      SELECT
        t.id,
        s.name AS section,
        sub.name AS subject,
        c.room_number AS classroom,
        t.day,
        t.period_no,
        t.start_time,
        t.end_time
      FROM timetable t
      JOIN sections s ON t.section_id = s.id
      JOIN subjects sub ON t.subject_id = sub.id
      JOIN classrooms c ON t.classroom_id = c.id
      WHERE t.teacher_id = $1
      AND t.day = TO_CHAR(CURRENT_DATE, 'Day')
      ORDER BY t.period_no
    `, [teacher_id]);

        res.json(result.rows);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const markAttendance = async (req, res) => {
    try {

        const { session_id, student_id, status, confidence } = req.body;

        const result = await pool.query(
            `INSERT INTO attendance_records
      (session_id,student_id,status,confidence)
      VALUES ($1,$2,$3,$4)
      RETURNING *`,
            [session_id, student_id, status, confidence]
        );

        res.json({
            message: "Attendance marked",
            data: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllAttendance = async (req, res) => {
    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied" });
        }

        const result = await pool.query(`
      SELECT 
        ar.id,
        u.name AS student_name,
        s.name AS section,
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

        res.json(result.rows);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getTeacherAttendance = async (req, res) => {
    try {

        if (req.user.role !== "teacher") {
            return res.status(403).json({ message: "Access denied" });
        }

        const teacher = await pool.query(
            `SELECT id FROM teachers WHERE user_id=$1`,
            [req.user.id]
        );

        const teacher_id = teacher.rows[0].id;

        const result = await pool.query(`
      SELECT 
        ar.id,
        u.name AS student_name,
        s.name AS section,
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

        res.json(result.rows);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getStudentAttendance = async (req, res) => {
    try {

        if (req.user.role !== "student") {
            return res.status(403).json({ message: "Access denied" });
        }

        const student = await pool.query(
            `SELECT id FROM students WHERE user_id=$1`,
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

        res.json(result.rows);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};