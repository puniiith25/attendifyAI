import { pool } from "../../Database/db.js";

export const getSessionSummary = async (req, res) => {
    try {

        const { id } = req.params;

        const result = await pool.query(
            `SELECT
            COUNT(*) FILTER (WHERE status='present') AS present,
            COUNT(*) FILTER (WHERE status='absent') AS absent,
            COUNT(*) AS total
            FROM attendance_records
            WHERE session_id=$1`,
            [id]
        );

        res.json({ success: true, summary: result.rows[0] });

    } catch (err) {
        res.status(500).json({ success: false });
    }
};


export const getSessionDetails = async (req, res) => {
    try {

        const { id } = req.params;

        /* ==============================
           CHECK SESSION EXISTS
        ============================== */

        const session = await pool.query(
            `SELECT 
                s.id,
                s.section_id,
                s.subject_id,
                s.teacher_id,
                s.period_no,
                s.method,
                s.class_date,
                s.session_status
             FROM attendance_sessions s
             WHERE s.id=$1`,
            [id]
        );

        if (session.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Session not found"
            });
        }

        const section_id = session.rows[0].section_id;

        /* ==============================
           GET STUDENTS OF SECTION
        ============================== */

        const students = await pool.query(
            `SELECT 
                st.id AS student_id,
                st.roll_number,
                u.name
             FROM students st
             JOIN users u ON st.user_id = u.id
             WHERE st.section_id=$1
             ORDER BY st.roll_number`,
            [section_id]
        );

        /* ==============================
           GET ATTENDANCE RECORDS
        ============================== */

        const records = await pool.query(
            `SELECT 
                student_id,
                status,
                confidence,
                method,
                marked_by,
                image_url
             FROM attendance_records
             WHERE session_id=$1`,
            [id]
        );

        const attendanceMap = {};

        for (const r of records.rows) {
            attendanceMap[r.student_id] = r;
        }

        /* ==============================
           BUILD FINAL RESPONSE
        ============================== */

        const result = students.rows.map(student => {

            const record = attendanceMap[student.student_id];

            return {
                student_id: student.student_id,
                name: student.name,
                roll_number: student.roll_number,
                status: record ? record.status : "absent",
                confidence: record ? record.confidence : null,
                method: record ? record.method : null,
                image_url: record ? record.image_url : null
            };

        });

        res.json({
            success: true,
            session: session.rows[0],
            attendance: result
        });

    } catch (error) {

        console.error("Session details error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }
};