import { pool } from "../Database/db.js";


/* =========================================
STORE CROPPED FACE IMAGE (AI RESULT)
========================================= */

export const storeFaceImage = async (req, res) => {
    try {

        const { session_id, student_id, image_url, confidence } = req.body;

        if (!session_id || !student_id || !image_url) {
            return res.status(400).json({
                success: false,
                message: "session_id, student_id and image_url required"
            });
        }

        const session = await pool.query(
            "SELECT id FROM attendance_sessions WHERE id=$1",
            [session_id]
        );

        if (session.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Session not found"
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

        const result = await pool.query(

            `INSERT INTO attendance_faces
(session_id,student_id,image_url,confidence)
VALUES ($1,$2,$3,$4)
RETURNING *`,

            [session_id, student_id, image_url, confidence || null]

        );

        res.status(201).json({
            success: true,
            face: result.rows[0]
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }

};



/* =========================================
GET ALL CROPPED IMAGES FOR A SESSION
========================================= */

export const getSessionFaceImages = async (req, res) => {
    try {

        const { session_id } = req.params;

        const result = await pool.query(

            `SELECT
af.id,
u.name AS student_name,
af.image_url,
af.confidence,
af.created_at
FROM attendance_faces af
JOIN students st ON af.student_id = st.id
JOIN users u ON st.user_id = u.id
WHERE af.session_id=$1
ORDER BY af.created_at DESC`,

            [session_id]

        );

        res.json({
            success: true,
            count: result.rowCount,
            faces: result.rows
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }

};



/* =========================================
GET STUDENT FACE PROOF
========================================= */

export const getStudentFaceProof = async (req, res) => {
    try {

        const { student_id } = req.params;

        const result = await pool.query(

            `SELECT
image_url,
confidence,
created_at
FROM attendance_faces
WHERE student_id=$1
ORDER BY created_at DESC`,

            [student_id]

        );

        res.json({
            success: true,
            faces: result.rows
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }

};



/* =========================================
DELETE FACE IMAGE (ADMIN)
========================================= */

export const deleteFaceImage = async (req, res) => {
    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Admin only"
            });
        }

        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM attendance_faces WHERE id=$1 RETURNING id",
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Image not found"
            });
        }

        res.json({
            success: true,
            message: "Face image deleted"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }

};