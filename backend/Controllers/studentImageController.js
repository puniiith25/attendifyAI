import axios from "axios";
import { pool } from "../Database/db.js";
import { supabase } from "../config/supabase.js";

export const uploadMyImage = async (req, res) => {

    try {

        if (req.user.role !== "student") {
            return res.status(403).json({
                success: false,
                message: "Only students allowed"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image required"
            });
        }

        const student = await pool.query(
            "SELECT id,section_id FROM students WHERE user_id=$1",
            [req.user.id]
        );

        if (student.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        const student_id = student.rows[0].id;
        const section_id = student.rows[0].section_id;

        const fileName = `student_${student_id}_${Date.now()}.jpg`;

        const { error } = await supabase.storage
            .from("Students-faces")
            .upload(fileName, req.file.buffer, {
                contentType: req.file.mimetype
            });

        if (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }

        const { data } = supabase.storage
            .from("Students-faces")
            .getPublicUrl(fileName);

        const image_url = data.publicUrl;

        await pool.query(
            "UPDATE students SET image_url=$1 WHERE id=$2",
            [image_url, student_id]
        );

        const aiResponse = await axios.post(
            "http://127.0.0.1:9000/api/create-embedding",
            { image_url }
        );

        const embedding = aiResponse.data.embedding;

        if (embedding) {

            const vector = `[${embedding.join(",")}]`;

            await pool.query(
                `INSERT INTO student_faces
(student_id,section_id,image_url,embedding)
VALUES ($1,$2,$3,$4)
ON CONFLICT (student_id)
DO UPDATE SET
embedding=$4,
image_url=$3`,
                [student_id, section_id, image_url, vector]
            );

        }

        res.json({
            success: true,
            message: "Image uploaded and embedding generated",
            image_url
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};


export const getMyImage = async (req, res) => {

    try {

        if (req.user.role !== "student") {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        const result = await pool.query(
            `SELECT s.image_url,f.embedding
FROM students s
LEFT JOIN student_faces f
ON s.id=f.student_id
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
            image_url: result.rows[0].image_url,
            embedding: result.rows[0].embedding
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }

};


export const updateMyImage = async (req, res) => {

    try {

        if (req.user.role !== "student") {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image required"
            });
        }

        const student = await pool.query(
            "SELECT id,section_id FROM students WHERE user_id=$1",
            [req.user.id]
        );

        if (student.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        const student_id = student.rows[0].id;
        const section_id = student.rows[0].section_id;

        const fileName = `student_${student_id}_${Date.now()}.jpg`;

        await supabase.storage
            .from("student-faces")
            .upload(fileName, req.file.buffer, {
                contentType: req.file.mimetype
            });

        const { data } = supabase.storage
            .from("student-faces")
            .getPublicUrl(fileName);

        const image_url = data.publicUrl;

        await pool.query(
            "UPDATE students SET image_url=$1 WHERE id=$2",
            [image_url, student_id]
        );

        const aiResponse = await axios.post(
            "http://127.0.0.1:8000/create-embedding",
            { image_url }
        );

        const embedding = aiResponse.data.embedding;

        if (embedding) {

            const vector = `[${embedding.join(",")}]`;

            await pool.query(
                `UPDATE student_faces
SET embedding=$1,image_url=$2
WHERE student_id=$3`,
                [vector, image_url, student_id]
            );

        }

        res.json({
            success: true,
            message: "Image updated and embedding regenerated",
            image_url
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }

};


export const deleteMyImage = async (req, res) => {

    try {

        if (req.user.role !== "student") {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        const student = await pool.query(
            "SELECT id,image_url FROM students WHERE user_id=$1",
            [req.user.id]
        );

        if (student.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        const student_id = student.rows[0].id;
        const image_url = student.rows[0].image_url;

        if (image_url) {

            const path = image_url.split("/student-faces/")[1];

            await supabase.storage
                .from("student-faces")
                .remove([path]);

        }

        await pool.query(
            "UPDATE students SET image_url=NULL WHERE id=$1",
            [student_id]
        );

        await pool.query(
            "DELETE FROM student_faces WHERE student_id=$1",
            [student_id]
        );

        res.json({
            success: true,
            message: "Image and embedding deleted"
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }

};