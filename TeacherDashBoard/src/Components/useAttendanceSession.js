import { useState } from "react";
import {
    startAttendanceSession,
    getSessionStudents,
    getSessionDetails
} from "./attendanceService";

export default function useAttendanceSession() {

    const [students, setStudents] = useState([]);
    const [sessionId, setSessionId] = useState(null);

    /* START SESSION */

    const startSession = async (method) => {

        const data = await startAttendanceSession(method);

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

    const updateStudent = (id, status, manual = true) => {

        setStudents(prev =>
            prev.map(s =>
                s.id === id
                    ? {
                        ...s,
                        status,
                        method: manual ? "manual" : s.method
                    }
                    : s
            )
        )

    }

    /* MARK ALL PRESENT */

    const markAllPresent = () => {

        setStudents(prev =>
            prev.map(s => ({
                ...s,
                status: "present",
                method: "manual"
            }))
        );

    };

    return {
        students,
        sessionId,
        startSession,
        updateStudent,
        markAllPresent
    };
}