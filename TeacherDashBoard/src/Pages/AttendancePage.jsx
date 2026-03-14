import { useState, useContext } from "react"
import { T_AppContext } from "../Context/T_AppContex"

import SessionList from "../Components/SessionList"
import MethodSelector from "../Components/MethodSelector"
import StudentTable from "../Components/StudentTable"
import AttendanceCamera from "../Components/AttendanceCamera"
import QRScanner from "../Components/QRScanner"
import LiveDetectedStudents from "../Components/LiveDetectedStudents"
import useAttendanceSession from "../Components/useAttendanceSession"

import {
    submitAttendance,
    closeAttendanceSession
} from "../Components/attendanceService"

export default function AttendancePage() {

    const { timetable } = useContext(T_AppContext)

    const {
        students,
        sessionId,
        startSession,
        updateStudent,
        markAllPresent
    } = useAttendanceSession()

    const [step, setStep] = useState("sessions")
    const [selectedSession, setSelectedSession] = useState(null)
    const [method, setMethod] = useState(null)

    const [detected, setDetected] = useState([])

    /* =========================
       HANDLE FACE DETECTION
    ========================= */

    const handleDetection = (student) => {

        setDetected(prev => {

            const exists = prev.find(s => s.id === student.id)

            if (exists) return prev

            return [
                ...prev,
                {
                    id: student.id,
                    crop: student.crop,
                    confidence: student.confidence
                }
            ]

        })

        updateStudent(student.id, "present", false)

    }

    /* =========================
       SESSION SELECT
    ========================= */

    const handleSessionSelect = (session) => {

        setSelectedSession(session)
        setStep("method")

    }

    /* =========================
       METHOD SELECT
    ========================= */

    const handleMethodSelect = async (m) => {

        setMethod(m)

        const data = await startSession(m)

        if (data.success) {
            setStep("attendance")
        }

    }

    /* =========================
       SUBMIT ATTENDANCE
    ========================= */

    const handleSubmitAttendance = async () => {

        try {

            const res = await submitAttendance(sessionId)

            if (res.success) {

                alert("Attendance submitted")

                setDetected([])
                setSelectedSession(null)
                setMethod(null)

                setStep("sessions")

            }

        } catch (error) {

            console.error(error)

        }

    }

    return (

        <div className="p-6">

            <h1 className="text-2xl font-semibold mb-6">
                Attendance Management
            </h1>

            {/* =========================
               SESSION LIST
            ========================= */}

            {step === "sessions" && (

                <SessionList
                    sessions={timetable}
                    onSelect={handleSessionSelect}
                />

            )}

            {/* =========================
               METHOD SELECT
            ========================= */}

            {step === "method" && (

                <MethodSelector
                    session={selectedSession}
                    onSelect={handleMethodSelect}
                />

            )}

            {/* =========================
               ATTENDANCE SCREEN
            ========================= */}

            {step === "attendance" && (

                <div>

                    <h2 className="text-lg font-semibold mb-4">
                        {selectedSession.subject} - {selectedSession.section}
                    </h2>

                    {/* CAMERA + LIVE DETECTION */}

                    <div className="grid grid-cols-2 gap-4 mb-6">

                        <div>

                            {method === "face" && (

                                <AttendanceCamera
                                    key={sessionId}
                                    sessionId={sessionId}
                                    onDetect={handleDetection}
                                />

                            )}

                            {method === "qr" && (

                                <QRScanner />

                            )}

                        </div>

                        <LiveDetectedStudents detected={detected} />

                    </div>

                    {/* STUDENT TABLE */}

                    <StudentTable
                        students={students}
                        onUpdate={updateStudent}
                    />

                    {/* ACTION BUTTONS */}

                    <div className="flex justify-end gap-4 mt-6">

                        <button
                            onClick={markAllPresent}
                            className="bg-gray-200 px-4 py-2 rounded"
                        >
                            Mark All Present
                        </button>

                        <button
                            onClick={handleSubmitAttendance}
                            className="bg-blue-600 text-white px-6 py-2 rounded"
                        >
                            Submit Attendance
                        </button>

                    </div>

                </div>

            )}

        </div>

    )

}