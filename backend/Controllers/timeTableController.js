import { pool } from "../Database/db.js";

export const createTimetable = async (req, res) => {
    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Only admin can create timetable" });
        }

        const {
            section_id,
            subject_id,
            teacher_id,
            classroom_id,
            day,
            period_no,
            start_time,
            end_time
        } = req.body;

        const result = await pool.query(
            `INSERT INTO timetable
      (section_id,subject_id,teacher_id,classroom_id,day,period_no,start_time,end_time)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *`,
            [
                section_id,
                subject_id,
                teacher_id,
                classroom_id,
                day,
                period_no,
                start_time,
                end_time
            ]
        );

        res.json({
            message: "Timetable created",
            data: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getAllTimetables = async (req, res) => {
    try {

        const result = await pool.query(`
      SELECT
        t.id,
        s.name AS section,
        sub.name AS subject,
        u.name AS teacher,
        c.room_number AS classroom,
        t.day,
        t.period_no,
        t.start_time,
        t.end_time
      FROM timetable t
      JOIN sections s ON t.section_id = s.id
      JOIN subjects sub ON t.subject_id = sub.id
      JOIN teachers te ON t.teacher_id = te.id
      JOIN users u ON te.user_id = u.id
      JOIN classrooms c ON t.classroom_id = c.id
      ORDER BY s.name,t.day,t.period_no
    `);

        res.json(result.rows);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getTeacherTimetable = async (req, res) => {
    try {

        const teacher = await pool.query(
            `SELECT id FROM teachers WHERE user_id=$1`,
            [req.user.id]
        );

        const teacher_id = teacher.rows[0].id;

        const result = await pool.query(`
      SELECT
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
      WHERE t.teacher_id=$1
      ORDER BY t.day,t.period_no
    `, [teacher_id]);

        res.json(result.rows);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const getStudentTimetable = async (req, res) => {
    try {

        const student = await pool.query(
            `SELECT section_id FROM students WHERE user_id=$1`,
            [req.user.id]
        );

        const section_id = student.rows[0].section_id;

        const result = await pool.query(`
      SELECT
        sub.name AS subject,
        u.name AS teacher,
        c.room_number AS classroom,
        t.day,
        t.period_no,
        t.start_time,
        t.end_time
      FROM timetable t
      JOIN subjects sub ON t.subject_id = sub.id
      JOIN teachers te ON t.teacher_id = te.id
      JOIN users u ON te.user_id = u.id
      JOIN classrooms c ON t.classroom_id = c.id
      WHERE t.section_id=$1
      ORDER BY t.day,t.period_no
    `, [section_id]);

        res.json(result.rows);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};