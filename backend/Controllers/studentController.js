import bcrypt from "bcrypt";
import axios from "axios";
import { supabase } from "../config/supabase.js";
import { pool } from "../Database/db.js";

export const createStudent = async (req, res) => {

    const client = await pool.connect();

    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admin can create students"
            });
        }

        const {
            name,
            email,
            password,
            roll_number,
            section_id,
            branch,
            semester,
            phone,
            admission_year
        } = req.body;

        if (!name || !email || !password || !roll_number || !section_id) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        /* ========================
        START TRANSACTION
        ======================== */

        await client.query("BEGIN");

        /* ========================
        CHECK EMAIL
        ======================== */

        const emailCheck = await client.query(
            "SELECT id FROM users WHERE email=$1",
            [email]
        );

        if (emailCheck.rowCount > 0) {
            await client.query("ROLLBACK");

            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        /* ========================
        CREATE USER
        ======================== */

        const hash = await bcrypt.hash(password, 10);

        const userResult = await client.query(
            `INSERT INTO users(name,email,password_hash,role)
VALUES($1,$2,$3,'student')
RETURNING id`,
            [name, email, hash]
        );

        const userId = userResult.rows[0].id;

        /* ========================
        CHECK SECTION
        ======================== */

        const sectionCheck = await client.query(
            "SELECT id FROM sections WHERE id=$1",
            [section_id]
        );

        if (sectionCheck.rowCount === 0) {
            await client.query("ROLLBACK");

            return res.status(404).json({
                success: false,
                message: "Section not found"
            });
        }

        /* ========================
        CHECK ROLL DUPLICATE
        ======================== */

        const rollCheck = await client.query(
            "SELECT id FROM students WHERE roll_number=$1",
            [roll_number]
        );

        if (rollCheck.rowCount > 0) {
            await client.query("ROLLBACK");

            return res.status(409).json({
                success: false,
                message: "Roll number already exists"
            });
        }

        /* ========================
        UPLOAD IMAGE
        ======================== */

        let image_url = null;

        if (req.file) {

            const fileName = `student_${roll_number}_${Date.now()}.jpg`;

            const { error } = await supabase.storage
                .from("Students-faces")
                .upload(fileName, req.file.buffer, {
                    contentType: req.file.mimetype
                });

            if (error) {
                await client.query("ROLLBACK");

                return res.status(500).json({
                    success: false,
                    message: "Image upload failed"
                });
            }

            const { data } = supabase.storage
                .from("Students-faces")
                .getPublicUrl(fileName);

            image_url = data.publicUrl;

        }

        /* ========================
        CREATE STUDENT
        ======================== */

        const studentResult = await client.query(
            `INSERT INTO students
(user_id,roll_number,section_id,branch,semester,phone,admission_year,image_url)
VALUES($1,$2,$3,$4,$5,$6,$7,$8)
RETURNING *`,
            [
                userId,
                roll_number,
                section_id,
                branch,
                semester,
                phone,
                admission_year,
                image_url
            ]
        );

        const student = studentResult.rows[0];

        /* ========================
        FACE EMBEDDING
        ======================== */

        if (image_url) {

            const aiResponse = await axios.post(
                "http://127.0.0.1:9000/api/create-embedding",
                { image_url }
            );

            const embedding = aiResponse.data.embedding;

            if (embedding) {

                const vector = `[${embedding.join(",")}]`;

                await client.query(
                    `INSERT INTO student_faces
(student_id,section_id,image_url,embedding)
VALUES($1,$2,$3,$4)`,
                    [
                        student.id,
                        section_id,
                        image_url,
                        vector
                    ]
                );

            }

        }

        /* ========================
        COMMIT
        ======================== */

        await client.query("COMMIT");

        res.status(201).json({
            success: true,
            message: "Student created successfully",
            student
        });

    } catch (error) {

        await client.query("ROLLBACK");

        res.status(500).json({
            success: false,
            message: error.message
        });
        console.log(error)
    } finally {

        client.release();

    }

};
/* =========================================
GET ALL STUDENTS
========================================= */

export const getStudents = async (req, res) => {
    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admin can view students"
            });
        }

        const result = await pool.query(
            `SELECT 
                s.id AS student_id,
                s.roll_number,
                s.branch,
                s.semester,
                s.phone,
                s.admission_year,
                s.image_url,
                s.section_id,
                sec.sec_name AS section,
                
                u.name,
                u.email
            FROM students s
            JOIN users u ON s.user_id = u.id
            JOIN sections sec ON s.section_id = sec.id
            ORDER BY s.id ASC`
        );

        res.json({
            success: true,
            count: result.rowCount,
            students: result.rows
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

/* =========================================
GET STUDENT BY ID
========================================= */

export const getStudentById = async (req, res) => {
    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admin can view student"
            });
        }

        const { id } = req.params;

        const result = await pool.query(
            `SELECT
    s.id,
    s.roll_number,
    s.section_id,
    s.branch,
    s.semester,
    s.phone,
    s.admission_year,
    s.image_url,
    sec.sec_name AS section,
    u.name,
    u.email
FROM students s
JOIN users u ON s.user_id = u.id
JOIN sections sec ON s.section_id = sec.id
WHERE s.id=$1`,
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.json({
            success: true,
            student: result.rows[0]
        });

    } catch {

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
};

/* =========================================
GET LOGGED STUDENT
========================================= */

export const getLoggedStudent = async (req, res) => {
    try {

        if (req.user.role !== "student") {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        const result = await pool.query(
            `SELECT 
                s.id,
                s.roll_number,
                s.branch,
                s.semester,
                s.phone,
                s.admission_year,
                s.image_url,
                sec.sec_name AS section,
                u.name,
                u.email,
                u.role
            FROM students s
            JOIN users u ON s.user_id = u.id
            JOIN sections sec ON s.section_id = sec.id
            WHERE s.user_id=$1`,
            [req.user.id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.json({
            success: true,
            student: result.rows[0]
        });

    } catch {

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
};

/* =========================================
DELETE STUDENT
========================================= */

export const deleteStudent = async (req, res) => {
    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admin can delete student"
            });
        }

        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM students WHERE id=$1 RETURNING id",
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.json({
            success: true,
            message: "Student deleted successfully"
        });

    } catch {

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
};
export const updateStudent = async (req, res) => {

    const client = await pool.connect();

    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admin can update student"
            });
        }

        const { id } = req.params;

        const {
            name,
            email,
            roll_number,
            section_id,
            branch,
            semester,
            phone,
            admission_year
        } = req.body;

        await client.query("BEGIN");

        /* ==========================
           GET STUDENT
        ========================== */

        const studentResult = await client.query(
            `SELECT *
             FROM students
             WHERE id = $1`,
            [id]
        );

        if (studentResult.rowCount === 0) {

            await client.query("ROLLBACK");

            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        const student = studentResult.rows[0];
        const userId = student.user_id;

        /* ==========================
           CHECK EMAIL DUPLICATE
        ========================== */

        if (email) {

            const emailCheck = await client.query(
                `SELECT id
                 FROM users
                 WHERE email = $1
                 AND id <> $2`,
                [email, userId]
            );

            if (emailCheck.rowCount > 0) {

                await client.query("ROLLBACK");

                return res.status(409).json({
                    success: false,
                    message: "Email already exists"
                });
            }
        }

        /* ==========================
           CHECK SECTION
        ========================== */

        if (section_id) {

            const sectionCheck = await client.query(
                `SELECT id
                 FROM sections
                 WHERE id = $1`,
                [section_id]
            );

            if (sectionCheck.rowCount === 0) {

                await client.query("ROLLBACK");

                return res.status(404).json({
                    success: false,
                    message: "Section not found"
                });
            }
        }

        /* ==========================
           CHECK ROLL NUMBER
        ========================== */

        if (roll_number) {

            const duplicate = await client.query(
                `SELECT id
                 FROM students
                 WHERE roll_number = $1
                 AND id <> $2`,
                [roll_number, id]
            );

            if (duplicate.rowCount > 0) {

                await client.query("ROLLBACK");

                return res.status(409).json({
                    success: false,
                    message: "Roll number already exists"
                });
            }
        }

        /* ==========================
           UPDATE USER
        ========================== */

        await client.query(
            `UPDATE users
             SET
                name = COALESCE($1, name),
                email = COALESCE($2, email)
             WHERE id = $3`,
            [name, email, userId]
        );

        /* ==========================
           IMAGE UPDATE
        ========================== */

        let image_url = student.image_url;

        if (req.file) {

            const fileName = `student_${id}_${Date.now()}`;

            const { error } = await supabase.storage
                .from("Students-faces")
                .upload(fileName, req.file.buffer, {
                    contentType: req.file.mimetype,
                    upsert: true
                });

            if (error) {

                await client.query("ROLLBACK");

                return res.status(500).json({
                    success: false,
                    message: "Image upload failed"
                });
            }

            const { data } = supabase.storage
                .from("Students-faces")
                .getPublicUrl(fileName);

            image_url = data.publicUrl;
        }

        /* ==========================
           UPDATE STUDENT
        ========================== */

        const updatedStudent = await client.query(
            `UPDATE students
             SET
                roll_number = $1,
                section_id = $2,
                branch = $3,
                semester = $4,
                phone = $5,
                admission_year = $6,
                image_url = $7
             WHERE id = $8
             RETURNING *`,
            [
                roll_number ?? student.roll_number,
                section_id ?? student.section_id,
                branch ?? student.branch,
                semester ?? student.semester,
                phone ?? student.phone,
                admission_year ?? student.admission_year,
                image_url,
                id
            ]
        );

        /* ==========================
           UPDATE FACE EMBEDDING
        ========================== */

        if (req.file && image_url) {

            try {

                const aiResponse = await axios.post(
                    "http://127.0.0.1:9000/api/create-embedding",
                    { image_url }
                );

                const embedding = aiResponse.data.embedding;

                if (embedding) {

                    const vector = `[${embedding.join(",")}]`;

                    await client.query(
                        `INSERT INTO student_faces
                        (
                            student_id,
                            section_id,
                            image_url,
                            embedding
                        )
                        VALUES ($1,$2,$3,$4)
                        ON CONFLICT (student_id)
                        DO UPDATE SET
                            section_id = EXCLUDED.section_id,
                            image_url = EXCLUDED.image_url,
                            embedding = EXCLUDED.embedding`,
                        [
                            id,
                            section_id ?? student.section_id,
                            image_url,
                            vector
                        ]
                    );
                }

            } catch (embeddingError) {

                console.log(
                    "Embedding update failed:",
                    embeddingError.message
                );
            }
        }

        await client.query("COMMIT");

        return res.status(200).json({
            success: true,
            message: "Student updated successfully",
            student: updatedStudent.rows[0]
        });

    } catch (error) {

        await client.query("ROLLBACK");

        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    } finally {

        client.release();
    }
};

export const getStudentAttendanceStats = async (req, res) => {
    try {
        if (req.user.role !== "student") {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        // Get student's section and ID
        const studentRes = await pool.query(
            "SELECT id, section_id FROM students WHERE user_id = $1",
            [req.user.id]
        );

        if (studentRes.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        const student_id = studentRes.rows[0].id;
        const section_id = studentRes.rows[0].section_id;

        const statsQuery = await pool.query(
            `SELECT 
                sub.id AS subject_id,
                sub.name AS subject_name,
                sub.code AS subject_code,
                COALESCE(conducted.total, 0) AS total_sessions,
                COALESCE(attended.present, 0) AS present_sessions
             FROM subjects sub
             JOIN (
                SELECT DISTINCT subject_id 
                FROM timetable 
                WHERE section_id = $1
             ) section_subs ON sub.id = section_subs.subject_id
             LEFT JOIN (
                SELECT subject_id, COUNT(*)::int AS total
                FROM attendance_sessions
                WHERE section_id = $1
                GROUP BY subject_id
             ) conducted ON sub.id = conducted.subject_id
             LEFT JOIN (
                SELECT asess.subject_id, COUNT(DISTINCT ar.session_id)::int AS present
                FROM attendance_records ar
                JOIN attendance_sessions asess ON ar.session_id = asess.id
                WHERE ar.student_id = $2
                AND asess.section_id = $1
                AND ar.status = 'present'
                GROUP BY asess.subject_id
             ) attended ON sub.id = attended.subject_id`,
            [section_id, student_id]
        );

        res.json({
            success: true,
            stats: statsQuery.rows
        });

    } catch (error) {
        console.error("getStudentAttendanceStats error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};