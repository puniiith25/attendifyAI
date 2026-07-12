import { useState } from "react";
import {
    startAttendanceSession,
    getSessionStudents,
    getSessionDetails,
    markManualAttendance
} from "./attendanceService";

export default function useAttendanceSession() {

    const [students, setStudents] = useState([]);
    const [sessionId, setSessionId] = useState(null);

    /* START SESSION */

    const startSession = async (method, sessionDetails = null) => {

        const payload = { method };
        if (sessionDetails) {
            payload.section_id = sessionDetails.section_id;
            payload.subject_id = sessionDetails.subject_id;
            payload.period_no = sessionDetails.period_no;
        }

        const data = await startAttendanceSession(payload);

        if (!data.success) return data;

        const id = data.session.id;

        setSessionId(id);

        const studentData = await getSessionDetails(id);

        const formatted = (studentData.students || []).map(s => ({
            id: s.id,
            name: s.name,
            photo: s.student_photo,
            session_photo: s.capture_image,
            confidence: s.confidence,
            status: s.status || "absent",
            method: s.method
        }));

        setStudents(formatted);

        return data;
    };

    /* UPDATE STUDENT */

    const updateStudent = async (id, status, manual = true, crop = null, confidence = null) => {

        setStudents(prev =>
            prev.map(s =>
                s.id === id
                    ? {
                        ...s,
                        status,
                        method: manual ? "manual" : s.method,
                        session_photo: crop ? `data:image/jpeg;base64,${crop}` : s.session_photo,
                        confidence: confidence !== null ? confidence : s.confidence
                    }
                    : s
            )
        )

        if (manual && sessionId) {
            try {
                await markManualAttendance(sessionId, id, status);
            } catch (err) {
                console.error("Failed to mark manual attendance in DB:", err);
            }
        }

    }

    /* MARK ALL PRESENT */

    const markAllPresent = async () => {

        setStudents(prev =>
            prev.map(s => ({
                ...s,
                status: "present",
                method: "manual"
            }))
        );

        if (sessionId) {
            try {
                await Promise.all(
                    students.map(s =>
                        markManualAttendance(sessionId, s.id, "present")
                    )
                );
            } catch (err) {
                console.error("Failed to mark all present in DB:", err);
            }
        }

    };

    const resumeSession = async (id) => {
        setSessionId(id);

        const studentData = await getSessionDetails(id);

        const formatted = (studentData.students || []).map(s => ({
            id: s.id,
            name: s.name,
            photo: s.student_photo,
            session_photo: s.capture_image,
            confidence: s.confidence,
            status: s.status || "absent",
            method: s.method
        }));

        setStudents(formatted);
    };

    return {
        students,
        sessionId,
        startSession,
        updateStudent,
        markAllPresent,
        resumeSession
    };
}