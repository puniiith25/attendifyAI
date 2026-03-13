import { useState } from "react"
import { startAttendanceSession } from "../Components/attendanceService"
import defaultAvatar from "../assets/images/default-avatar-profile.jpg"
export default function useAttendanceSession() {

    const sessions = [

        {
            id: 1,
            section: "CSE-A",
            subject: "Artificial Intelligence",
            teacher: "Dr. Sharma",
            day: "Monday",
            period_no: 2,
            start_time: "10:00",
            end_time: "11:00"
        },

        {
            id: 2,
            section: "CSE-B",
            subject: "Machine Learning",
            teacher: "Dr. Patel",
            day: "Monday",
            period_no: 3,
            start_time: "11:00",
            end_time: "12:00"
        },

        {
            id: 3,
            section: "CSE-C",
            subject: "Data Science",
            teacher: "Dr. Reddy",
            day: "Tuesday",
            period_no: 1,
            start_time: "09:00",
            end_time: "10:00"
        },

        {
            id: 4,
            section: "CSE-A",
            subject: "Operating Systems",
            teacher: "Dr. Kumar",
            day: "Wednesday",
            period_no: 4,
            start_time: "12:00",
            end_time: "13:00"
        },

        {
            id: 5,
            section: "CSE-B",
            subject: "Computer Networks",
            teacher: "Dr. Singh",
            day: "Thursday",
            period_no: 5,
            start_time: "14:00",
            end_time: "15:00"
        },

        {
            id: 6,
            section: "CSE-C",
            subject: "Database Systems",
            teacher: "Dr. Verma",
            day: "Friday",
            period_no: 6,
            start_time: "15:00",
            end_time: "16:00"
        },

        {
            id: 7,
            section: "CSE-A",
            subject: "Cloud Computing",
            teacher: "Dr. Iyer",
            day: "Saturday",
            period_no: 7,
            start_time: "16:00",
            end_time: "17:00"
        }

    ]

    const [students, setStudents] = useState([
        {
            id: 1,
            name: "Rahul Sharma",
            photo: defaultAvatar,
            session_photo: null,
            status: "present"
        },

        {
            id: 2,
            name: "Priya Patel",
            photo: defaultAvatar,
            session_photo: null,
            status: "absent"
        },

        {
            id: 3,
            name: "Amit Kumar",
            photo: defaultAvatar,
            session_photo: defaultAvatar,
            status: "present"
        },

        {
            id: 4,
            name: "Sneha Reddy",
            photo: defaultAvatar,
            session_photo: null,
            status: "present"
        },

        {
            id: 5,
            name: "Vikram Singh",
            photo: defaultAvatar,
            session_photo: null,
            status: "absent"
        }
    ])

    const startSession = async (method) => {

        const data = await startAttendanceSession(method)

        console.log("Session Started:", data)

        return data
    }

    const updateStudent = (id, value) => {
        setStudents(prev =>
            prev.map(s =>
                s.id === id ? { ...s, status: value } : s
            )
        )
    }

    const markAllPresent = () => {
        setStudents(prev =>
            prev.map(s => ({ ...s, status: "present" }))
        )
    }

    return {
        sessions,
        students,
        startSession,
        updateStudent,
        markAllPresent
    }
}