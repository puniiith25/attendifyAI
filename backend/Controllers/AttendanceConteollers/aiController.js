import axios from "axios"
import FormData from "form-data"
import { pool } from "../../Database/db.js"
import { supabase } from "../../Config/supabase.js"

export const processFrame = async (req, res) => {

    try {

        const { session_id } = req.body

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Frame missing"
            })
        }

        /* =========================
        GET SESSION
        ========================= */

        const session = await pool.query(
            `SELECT section_id, session_status
             FROM attendance_sessions
             WHERE id=$1`,
            [session_id]
        )

        if (session.rowCount === 0)
            return res.status(404).json({ success: false })

        if (session.rows[0].session_status !== "open")
            return res.status(400).json({ success: false })

        const section_id = session.rows[0].section_id

        /* =========================
        SEND FRAME TO AI SERVER
        ========================= */

        const form = new FormData()

        form.append("frame", req.file.buffer, "frame.jpg")
        form.append("section_id", section_id)

        const ai = await axios.post(
            process.env.AI_SERVICE_URL + "/api/detect",
            form,
            { headers: form.getHeaders() }
        )

        const students = ai.data.students || []

        const detected = []

        for (const s of students) {

            if (!s.student_id) continue

            let image_url = null

            /* =========================
            SAVE FACE CROP
            ========================= */

            if (s.crop) {

                const base64 = s.crop.replace(/^data:image\/\w+;base64,/, "")
                const buffer = Buffer.from(base64, "base64")

                const filename =
                    `attendance/${session_id}_${s.student_id}_${Date.now()}.jpg`

                const { error } = await supabase.storage
                    .from("Students-faces")
                    .upload(filename, buffer, {
                        contentType: "image/jpeg"
                    })

                if (!error) {

                    image_url =
                        `${process.env.SUPABASE_URL}/storage/v1/object/public/Students-faces/${filename}`

                }
            }

            /* =========================
            SAVE ATTENDANCE RECORD
            ========================= */

            await pool.query(
                `INSERT INTO attendance_records
                (session_id,student_id,status,confidence,method,marked_by,image_url)
                VALUES ($1,$2,'present',$3,'face','ai',$4)

                ON CONFLICT(session_id,student_id)
                DO UPDATE SET
                    status='present',
                    confidence=$3,
                    method='face',
                    marked_by='ai',
                    image_url=COALESCE(attendance_records.image_url,$4)`,
                [session_id, s.student_id, s.confidence, image_url]
            )

            detected.push({
                student_id: s.student_id,
                confidence: s.confidence,
                crop: s.crop
            })
        }

        res.json({
            success: true,
            detected
        })

    } catch (err) {

        console.error("FRAME ERROR:", err)

        res.status(500).json({
            success: false
        })
    }
}