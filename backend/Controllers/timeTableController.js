import { pool } from "../Database/db.js";

export const createTimetable = async (req, res) => {
    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admin can create timetable"
            });
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

        if (!section_id || !subject_id || !teacher_id || !classroom_id || !day || !period_no || !start_time || !end_time) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const section = await pool.query("SELECT id FROM sections WHERE id=$1", [section_id]);
        const subject = await pool.query("SELECT id FROM subjects WHERE id=$1", [subject_id]);
        const teacher = await pool.query("SELECT id FROM teachers WHERE id=$1", [teacher_id]);
        const classroom = await pool.query("SELECT id FROM classrooms WHERE id=$1", [classroom_id]);

        if (!section.rowCount || !subject.rowCount || !teacher.rowCount || !classroom.rowCount) {
            return res.status(404).json({
                success: false,
                message: "Invalid section, subject, teacher or classroom"
            });
        }

        const duplicate = await pool.query(
            `SELECT id FROM timetable
             WHERE section_id=$1 AND day=$2 AND period_no=$3`,
            [section_id, day, period_no]
        );

        if (duplicate.rowCount > 0) {
            return res.status(409).json({
                success: false,
                message: "Timetable already exists for this section and period"
            });
        }

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

        res.status(201).json({
            success: true,
            timetable: result.rows[0]
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
};



export const getAllTimetables = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }
        const result = await pool.query(`
        SELECT
        t.id,
        s.sec_name AS section,
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
        ORDER BY s.sec_name,t.day,t.period_no
        `);

        res.json({
            success: true,
            count: result.rowCount,
            timetable: result.rows
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
};



export const getTeacherTimetable = async (req, res) => {
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
        s.sec_name AS section,
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

        res.json({
            success: true,
            timetable: result.rows
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
};



export const getStudentTimetable = async (req, res) => {
    try {

        if (req.user.role !== "student") {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        const student = await pool.query(
            "SELECT section_id FROM students WHERE user_id=$1",
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

        res.json({
            success: true,
            timetable: result.rows
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
};



export const updateTimetable = async (req, res) => {
    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admin can update timetable"
            });
        }

        const { id } = req.params;
        const { section_id, subject_id, teacher_id, classroom_id, day, period_no, start_time, end_time } = req.body;

        const result = await pool.query(
            `UPDATE timetable
            SET section_id=$1,
            subject_id=$2,
            teacher_id=$3,
            classroom_id=$4,
            day=$5,
            period_no=$6,
            start_time=$7,
            end_time=$8
            WHERE id=$9
            RETURNING *`,
            [section_id, subject_id, teacher_id, classroom_id, day, period_no, start_time, end_time, id]
        );

        res.json({
            success: true,
            timetable: result.rows[0]
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
};



export const deleteTimetable = async (req, res) => {
    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admin can delete timetable"
            });
        }

        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM timetable WHERE id=$1 RETURNING id",
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Timetable not found"
            });
        }

        res.json({
            success: true,
            message: "Timetable deleted"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
};