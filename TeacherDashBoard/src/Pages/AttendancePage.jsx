import { useState, useContext, useEffect } from "react"
import { T_AppContext } from "../Context/T_AppContex"

import SessionList from "../Components/SessionList"
import MethodSelector from "../Components/MethodSelector"
import StudentTable from "../Components/StudentTable"
import AttendanceCamera from "../Components/AttendanceCamera"
import LiveDetectedStudents from "../Components/LiveDetectedStudents"
import useAttendanceSession from "../Components/useAttendanceSession"

import {
    submitAttendance,
    closeAttendanceSession,
    getActiveSession
} from "../Components/attendanceService"

export default function AttendancePage() {

    const { timetable } = useContext(T_AppContext)

    const {
        students,
        sessionId,
        startSession,
        updateStudent,
        markAllPresent,
        resumeSession
    } = useAttendanceSession()

    const [step, setStep] = useState("sessions")
    const [selectedSession, setSelectedSession] = useState(null)
    const [method, setMethod] = useState(null)
    const [detected, setDetected] = useState([])
    const [activeSessionData, setActiveSessionData] = useState(null)

    /* =========================
       CHECK ACTIVE SESSION ON MOUNT
    ========================= */
    useEffect(() => {
        const checkActive = async () => {
            try {
                const data = await getActiveSession()
                if (data && data.active && data.session) {
                    setActiveSessionData(data.session)
                }
            } catch (err) {
                console.error("Error checking active session:", err)
            }
        }
        checkActive()
    }, [])

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

        updateStudent(student.id, "present", false, student.crop, student.confidence)

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
        try {
            setMethod(m)
            const data = await startSession(m, selectedSession)
            if (data && data.success) {
                setStep("attendance")
            } else {
                alert(data?.message || "Failed to start attendance session")
            }
        } catch (error) {
            console.error("Start session error:", error)
            const errMsg = error.response?.data?.message || error.message || "Failed to start attendance session"
            alert(errMsg)
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
                setActiveSessionData(null)
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
                <div className="space-y-6">
                    {activeSessionData && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-3">
                                <span className="flex h-3 w-3 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                                </span>
                                <div>
                                    <p className="font-semibold text-amber-900 text-sm">
                                        Active Session in Progress
                                    </p>
                                    <p className="text-xs text-amber-700">
                                        {activeSessionData.subject} ({activeSessionData.section}) — Period {activeSessionData.period_no}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={async () => {
                                    setSelectedSession({
                                        id: activeSessionData.id,
                                        section: activeSessionData.section,
                                        subject: activeSessionData.subject
                                    })
                                    setMethod(activeSessionData.method)
                                    await resumeSession(activeSessionData.id)
                                    setStep("attendance")
                                }}
                                className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
                            >
                                Resume Session
                            </button>
                        </div>
                    )}

                    <SessionList
                        sessions={timetable}
                        onSelect={handleSessionSelect}
                    />
                </div>
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

                    <div className="flex items-center gap-3 mb-4">
                        <h2 className="text-lg font-semibold">
                            {selectedSession.subject} - {selectedSession.section}
                        </h2>
                        <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-semibold border border-amber-200">
                            Edit Session
                        </span>
                    </div>

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