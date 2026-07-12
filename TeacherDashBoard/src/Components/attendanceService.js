import axios from "axios"

const API = "http://localhost:8000/api/v1/attendance"

/* START SESSION */

export const startAttendanceSession = async (payload) => {

    const res = await axios.post(
        `${API}/session/start`,
        payload,
        { withCredentials: true }
    )

    return res.data
}

/* CLOSE SESSION */

export const closeAttendanceSession = async (sessionId) => {

    const res = await axios.put(
        `${API}/session/close/${sessionId}`,
        {},
        { withCredentials: true }
    )

    return res.data
}

/* GET STUDENTS */

export const getSessionStudents = async (sessionId) => {

    const res = await axios.get(
        `${API}/session/${sessionId}/students`,
        { withCredentials: true }
    )

    return res.data
}

/* SEND FRAME */

export const sendFrameToAI = async (sessionId, imageBlob) => {

    const form = new FormData()

    form.append("frame", imageBlob)
    form.append("session_id", sessionId)

    const res = await axios.post(
        `${API}/frame`,
        form,
        {
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    )

    return res.data
}

/* SUBMIT ATTENDANCE */

export const submitAttendance = async (sessionId, students) => {

    const res = await axios.post(
        `${API}/session/submit`,
        {
            session_id: sessionId,
            students
        },
        { withCredentials: true }
    )

    return res.data
}
export const getSessionDetails = async (sessionId) => {

    const res = await axios.get(
        `${API}/session/${sessionId}/details`,
        { withCredentials: true }
    );

    return res.data;

};

export const getActiveSession = async () => {
    const res = await axios.get(
        `${API}/session/active`,
        { withCredentials: true }
    );
    return res.data;
};

export const markManualAttendance = async (sessionId, studentId, status) => {
    const res = await axios.post(
        `${API}/manual`,
        {
            session_id: sessionId,
            student_id: studentId,
            status
        },
        { withCredentials: true }
    );
    return res.data;
};