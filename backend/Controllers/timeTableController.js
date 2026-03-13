import { pool } from "../Database/db.js";


/* =========================================
CREATE TIMETABLE
========================================= */


export const createTimetable = async (req, res) => {

    const client = await pool.connect();

    try {

        /* ================================
        ROLE AUTHORIZATION
        ================================ */

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
            day_of_week,
            period_no,
            start_time,
            end_time,
            semester,
            academic_year,
            valid_from,
            valid_to
        } = req.body;

        /* ================================
        REQUIRED FIELD VALIDATION
        ================================ */

        if (
            section_id == null ||
            subject_id == null ||
            teacher_id == null ||
            classroom_id == null ||
            day_of_week == null ||
            period_no == null ||
            !start_time ||
            !end_time ||
            !semester ||
            !academic_year ||
            !valid_from ||
            !valid_to
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        /* ================================
        DAY VALIDATION
        ================================ */

        if (day_of_week < 0 || day_of_week > 6) {
            return res.status(400).json({
                success: false,
                message: "day_of_week must be between 0 and 6"
            });
        }

        /* ================================
        PERIOD VALIDATION
        ================================ */

        if (period_no <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid period number"
            });
        }

        /* ================================
        DATE VALIDATION
        ================================ */

        if (new Date(valid_from) > new Date(valid_to)) {
            return res.status(400).json({
                success: false,
                message: "valid_from must be before valid_to"
            });
        }

        /* ================================
        TIME VALIDATION
        ================================ */

        if (start_time >= end_time) {
            return res.status(400).json({
                success: false,
                message: "Start time must be before end time"
            });
        }

        /* ================================
        BEGIN DATABASE TRANSACTION
        ================================ */

        await client.query("BEGIN");

        /* ================================
        CHECK SECTION EXISTS
        ================================ */

        const sectionCheck = await client.query(
            "SELECT 1 FROM sections WHERE id=$1",
            [section_id]
        );

        if (sectionCheck.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Section not found"
            });
        }

        /* ================================
        CHECK SUBJECT EXISTS
        ================================ */

        const subjectCheck = await client.query(
            "SELECT 1 FROM subjects WHERE id=$1",
            [subject_id]
        );

        if (subjectCheck.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Subject not found"
            });
        }

        /* ================================
        CHECK TEACHER EXISTS
        ================================ */

        const teacherCheck = await client.query(
            "SELECT 1 FROM teachers WHERE id=$1",
            [teacher_id]
        );

        if (teacherCheck.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found"
            });
        }

        /* ================================
        CHECK CLASSROOM EXISTS
        ================================ */

        const roomCheck = await client.query(
            "SELECT 1 FROM classrooms WHERE id=$1",
            [classroom_id]
        );

        if (roomCheck.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Classroom not found"
            });
        }

        /* ================================
        SECTION CONFLICT CHECK
        ================================ */

        const sectionConflict = await client.query(
            `SELECT 1 FROM timetable
             WHERE section_id=$1
             AND semester=$2
             AND academic_year=$3
             AND day_of_week=$4
             AND period_no=$5`,
            [section_id, semester, academic_year, day_of_week, period_no]
        );

        if (sectionConflict.rowCount > 0) {
            await client.query("ROLLBACK");
            return res.status(409).json({
                success: false,
                message: "Section already has class in this period"
            });
        }

        /* ================================
        TEACHER TIME CONFLICT
        ================================ */

        const teacherConflict = await client.query(
            `SELECT 1 FROM timetable
             WHERE teacher_id=$1
             AND semester=$2
             AND academic_year=$3
             AND day_of_week=$4
             AND start_time < $5
             AND end_time > $6`,
            [teacher_id, semester, academic_year, day_of_week, end_time, start_time]
        );

        if (teacherConflict.rowCount > 0) {
            await client.query("ROLLBACK");
            return res.status(409).json({
                success: false,
                message: "Teacher already assigned in this time"
            });
        }

        /* ================================
        CLASSROOM CONFLICT
        ================================ */

        const roomConflict = await client.query(
            `SELECT 1 FROM timetable
             WHERE classroom_id=$1
             AND semester=$2
             AND academic_year=$3
             AND day_of_week=$4
             AND start_time < $5
             AND end_time > $6`,
            [classroom_id, semester, academic_year, day_of_week, end_time, start_time]
        );

        if (roomConflict.rowCount > 0) {
            await client.query("ROLLBACK");
            return res.status(409).json({
                success: false,
                message: "Classroom already occupied"
            });
        }

        /* ================================
        INSERT TIMETABLE
        ================================ */

        const result = await client.query(
            `INSERT INTO timetable
            (section_id, subject_id, teacher_id, classroom_id,
             day_of_week, period_no, start_time, end_time,
             semester, academic_year, valid_from, valid_to)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
            RETURNING *`,
            [
                section_id,
                subject_id,
                teacher_id,
                classroom_id,
                day_of_week,
                period_no,
                start_time,
                end_time,
                semester,
                academic_year,
                valid_from,
                valid_to
            ]
        );

        await client.query("COMMIT");

        res.status(201).json({
            success: true,
            message: "Timetable created successfully",
            timetable: result.rows[0]
        });

    } catch (error) {

        await client.query("ROLLBACK");

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    } finally {

        client.release();

    }

};



/* =========================================
GET ALL TIMETABLES (ADMIN)
========================================= */

export const getAllTimetables = async (req, res) => {

    try {

        const result = await pool.query(`
        SELECT
            t.id,
            t.section_id,
            s.sec_name AS section,
            sub.name AS subject,
            u.name AS teacher,
            c.room_number AS classroom,
            t.day_of_week,
            t.period_no,
            t.start_time,
            t.end_time,
            t.semester,
            t.academic_year,
            t.valid_from,
            t.valid_to
        FROM timetable t
        JOIN sections s ON t.section_id = s.id
        JOIN subjects sub ON t.subject_id = sub.id
        JOIN teachers te ON t.teacher_id = te.id
        JOIN users u ON te.user_id = u.id
        JOIN classrooms c ON t.classroom_id = c.id
        ORDER BY s.sec_name, t.day_of_week, t.period_no
        `);

        res.json({
            success: true,
            count: result.rowCount,
            timetable: result.rows
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};



/* =========================================
GET TEACHER TIMETABLE
========================================= */

export const getTeacherTimetable = async (req, res) => {

    try {

        const teacher = await pool.query(
            "SELECT id FROM teachers WHERE user_id=$1",
            [req.user.id]
        );
        if (teacher.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found"
            })
        }
        const teacher_id = teacher.rows[0].id;

        const result = await pool.query(
            `SELECT
            t.id,
            s.sec_name AS section,
            sub.name AS subject,
            c.room_number AS classroom,
            t.day_of_week,
            t.period_no,
            t.start_time,
            t.end_time,
            t.semester,
            t.academic_year,
            t.valid_from,
            t.valid_to
            FROM timetable t
            JOIN subjects sub ON t.subject_id=sub.id
            JOIN sections s ON t.section_id=s.id
            JOIN classrooms c ON t.classroom_id=c.id
            WHERE t.teacher_id=$1
            ORDER BY t.day_of_week, t.period_no`,
            [teacher_id]
        );

        res.json({
            success: true,
            timetable: result.rows
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};



/* =========================================
GET STUDENT TIMETABLE
========================================= */

export const getStudentTimetable = async (req, res) => {

    try {

        const student = await pool.query(
            "SELECT section_id FROM students WHERE user_id=$1",
            [req.user.id]
        );
        if (student.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            })
        }
        const section_id = student.rows[0].section_id;

        const result = await pool.query(
            `SELECT
            t.id,
            sub.name AS subject,
            u.name AS teacher,
            c.room_number AS classroom,
            t.day_of_week,
            t.period_no,
            t.start_time,
            t.end_time,
            t.semester,
            t.academic_year,
            t.valid_from,
            t.valid_to
            FROM timetable t
            JOIN subjects sub ON t.subject_id=sub.id
            JOIN teachers te ON t.teacher_id=te.id
            JOIN users u ON te.user_id=u.id
            JOIN classrooms c ON t.classroom_id=c.id
            WHERE t.section_id=$1
            ORDER BY t.day_of_week, t.period_no`,
            [section_id]
        );

        res.json({
            success: true,
            timetable: result.rows
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};



/* =========================================
UPDATE TIMETABLE
========================================= */

export const updateTimetable = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            section_id,
            subject_id,
            teacher_id,
            classroom_id,
            day_of_week,
            period_no,
            start_time,
            end_time,
            semester,
            academic_year,
            valid_from,
            valid_to
        } = req.body;

        const result = await pool.query(
            `UPDATE timetable
            SET
            section_id=$1,
            subject_id=$2,
            teacher_id=$3,
            classroom_id=$4,
            day_of_week=$5,
            period_no=$6,
            start_time=$7,
            end_time=$8,
            semester=$9,
            academic_year=$10,
            valid_from=$11,
            valid_to=$12
            WHERE id=$13
            RETURNING *`,
            [
                section_id,
                subject_id,
                teacher_id,
                classroom_id,
                day_of_week,
                period_no,
                start_time,
                end_time,
                semester,
                academic_year,
                valid_from,
                valid_to,
                id
            ]
        );

        res.json({
            success: true,
            message: "Timetable updated",
            timetable: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};



/* =========================================
DELETE TIMETABLE
========================================= */

export const deleteTimetable = async (req, res) => {

    try {

        const { id } = req.params;

        await pool.query(
            "DELETE FROM timetable WHERE id=$1",
            [id]
        );

        res.json({
            success: true,
            message: "Timetable deleted"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};