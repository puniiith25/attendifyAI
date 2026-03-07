import axios from "axios";
import FormData from "form-data";
import { pool } from "../../Database/db.js";
import { supabase } from "../../utils/supabase.js";

export const processFrame = async (req, res) => {
    try {

        const { session_id } = req.body;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Frame image required"
            });
        }

        const session = await pool.query(
            `SELECT section_id,session_status
       FROM attendance_sessions
       WHERE id=$1`,
            [session_id]
        );

        if (session.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Session not found"
            });
        }

        if (session.rows[0].session_status !== "open") {
            return res.status(400).json({
                success: false,
                message: "Session closed"
            });
        }

        const section_id = session.rows[0].section_id;

        const form = new FormData();

        form.append("frame", req.file.buffer, "frame.jpg");
        form.append("section_id", section_id);

        const ai = await axios.post(
            process.env.AI_SERVICE_URL + "/api/detect",
            form,
            { headers: form.getHeaders() }
        );

        const students = ai.data.students;

        const inserted = [];

        for (const s of students) {

            const exists = await pool.query(
                `SELECT student_id
         FROM attendance_records
         WHERE session_id=$1 AND student_id=$2`,
                [session_id, s.student_id]
            );

            if (exists.rowCount > 0) {
                continue;
            }


            const buffer = Buffer.from(s.crop, "base64");

            const filename = `${session_id}/${s.student_id}_${Date.now()}.jpg`;

            const { data, error } = await supabase.storage
                .from("attendance-faces")
                .upload(filename, buffer, {
                    contentType: "image/jpeg"
                });

            if (error) {
                console.log(error);
                continue;
            }

            const image_url =
                `${process.env.SUPABASE_URL}/storage/v1/object/public/attendance-faces/${filename}`;

            /* ==============================
               INSERT ATTENDANCE
            ============================== */

            await pool.query(

                `INSERT INTO attendance_records
        (session_id,student_id,status,confidence,method,marked_by,image_url)
        VALUES ($1,$2,'present',$3,'face','ai',$4)
        ON CONFLICT (session_id,student_id) DO NOTHING`,

                [session_id, s.student_id, s.confidence, image_url]

            );

            inserted.push({
                student_id: s.student_id,
                confidence: s.confidence,
                image: image_url
            });

        }

        res.json({
            success: true,
            detected: inserted
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "AI processing failed"
        });

    }
};