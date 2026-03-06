import { pool } from "../Database/db.js";

export const createSection = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admin can create section"
            });
        }

        let { sec_name, academic_year } = req.body;

        if (!sec_name || !academic_year) {
            return res.status(400).json({
                success: false,
                message: "sec_name and academic_year are required"
            });
        }

        sec_name = sec_name.trim().toUpperCase();

        const existing = await pool.query(
            "SELECT id FROM sections WHERE sec_name=$1",
            [sec_name]
        );

        if (existing.rowCount > 0) {
            return res.status(409).json({
                success: false,
                message: "Section already exists"
            });
        }

        const result = await pool.query(
            `INSERT INTO sections (sec_name, academic_year)
             VALUES ($1,$2)
             RETURNING *`,
            [sec_name, academic_year]
        );

        res.status(201).json({
            success: true,
            message: "Section created successfully",
            section: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
};


export const getSections = async (req, res) => {
    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admin can view sections"
            });
        }

        const result = await pool.query(
            "SELECT * FROM sections ORDER BY id ASC"
        );

        res.json({
            success: true,
            count: result.rowCount,
            sections: result.rows
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
};


export const getSingleSection = async (req, res) => {
    try {

        const { id } = req.params;

        const result = await pool.query(
            "SELECT * FROM sections WHERE id=$1",
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Section not found"
            });
        }

        res.json({
            success: true,
            section: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
};


export const updateSection = async (req, res) => {
    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admin can update section"
            });
        }

        const { id } = req.params;
        let { sec_name, academic_year } = req.body;

        const section = await pool.query(
            "SELECT * FROM sections WHERE id=$1",
            [id]
        );

        if (section.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Section not found"
            });
        }

        if (sec_name) {

            sec_name = sec_name.trim().toUpperCase();

            const duplicate = await pool.query(
                "SELECT id FROM sections WHERE sec_name=$1 AND id<>$2",
                [sec_name, id]
            );

            if (duplicate.rowCount > 0) {
                return res.status(409).json({
                    success: false,
                    message: "Section name already exists"
                });
            }
        }

        const result = await pool.query(
            `UPDATE sections
             SET sec_name=$1, academic_year=$2
             WHERE id=$3
             RETURNING *`,
            [
                sec_name || section.rows[0].sec_name,
                academic_year || section.rows[0].academic_year,
                id
            ]
        );

        res.json({
            success: true,
            message: "Section updated successfully",
            section: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
};


export const deleteSection = async (req, res) => {
    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admin can delete section"
            });
        }

        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM sections WHERE id=$1 RETURNING id",
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Section not found"
            });
        }

        res.json({
            success: true,
            message: "Section deleted successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
};


export const getSectionDashboard = async (req, res) => {

    try {

        const { id } = req.params;

        if (req.user.role === "teacher") {

            const teacherSection = await pool.query(
                "SELECT section_id FROM timetable WHERE teacher_id=$1 LIMIT 1",
                [req.user.id]
            );

            if (
                teacherSection.rowCount === 0 ||
                teacherSection.rows[0].section_id != id
            ) {
                return res.status(403).json({
                    success: false,
                    message: "You can only access your assigned section"
                });
            }

        }

        if (req.user.role === "student") {

            const studentSection = await pool.query(
                "SELECT section_id FROM students WHERE user_id=$1",
                [req.user.id]
            );

            if (
                studentSection.rowCount === 0 ||
                studentSection.rows[0].section_id != id
            ) {
                return res.status(403).json({
                    success: false,
                    message: "You can only access your section"
                });
            }

        }

        const section = await pool.query(
            "SELECT * FROM sections WHERE id=$1",
            [id]
        );

        if (section.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Section not found"
            });
        }

        const students = await pool.query(`
            SELECT 
                st.id,
                u.name,
                st.roll_number,
                st.register_no
            FROM students st
            JOIN users u ON st.user_id = u.id
            WHERE st.section_id=$1
            ORDER BY st.roll_number
        `, [id]);

        const teachers = await pool.query(`
            SELECT DISTINCT
                t.id,
                u.name,
                t.department
            FROM timetable tb
            JOIN teachers t ON tb.teacher_id = t.id
            JOIN users u ON t.user_id = u.id
            WHERE tb.section_id=$1
        `, [id]);

        const subjects = await pool.query(`
            SELECT DISTINCT
                s.id,
                s.name,
                s.code
            FROM timetable tb
            JOIN subjects s ON tb.subject_id = s.id
            WHERE tb.section_id=$1
        `, [id]);

        const timetable = await pool.query(`
            SELECT
                tb.day,
                tb.period_no,
                tb.start_time,
                tb.end_time,
                sub.name AS subject,
                u.name AS teacher,
                c.room_number
            FROM timetable tb
            JOIN subjects sub ON tb.subject_id=sub.id
            JOIN teachers t ON tb.teacher_id=t.id
            JOIN users u ON t.user_id=u.id
            JOIN classrooms c ON tb.classroom_id=c.id
            WHERE tb.section_id=$1
            ORDER BY tb.day, tb.period_no
        `, [id]);

        const attendance = await pool.query(`
            SELECT 
                COUNT(*) FILTER (WHERE ar.status='present') AS present,
                COUNT(*) FILTER (WHERE ar.status='absent') AS absent
            FROM attendance_records ar
            JOIN attendance_sessions s ON ar.session_id=s.id
            WHERE s.section_id=$1
        `, [id]);

        res.json({
            success: true,
            section: section.rows[0],
            students: students.rows,
            teachers: teachers.rows,
            subjects: subjects.rows,
            timetable: timetable.rows,
            attendance_summary: attendance.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }

};