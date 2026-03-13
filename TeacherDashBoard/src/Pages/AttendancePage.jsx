import { useState } from "react"
import SessionList from "../Components/SessionList"
import MethodSelector from "../Components/MethodSelector"
import StudentTable from "../Components/StudentTable"
import AttendanceCamera from "../Components/AttendanceCamera"
import QRScanner from "../Components/QRScanner"
import LiveDetectedStudents from "../Components/LiveDetectedStudents"
import useAttendanceSession from "../Components/useAttendanceSession"

export default function AttendancePage() {

    const {
        sessions,
        students,
        startSession,
        updateStudent,
        markAllPresent
    } = useAttendanceSession()

    const [step, setStep] = useState("sessions")
    const [selectedSession, setSelectedSession] = useState(null)
    const [method, setMethod] = useState(null)

    const [detected, setDetected] = useState([])

    const handleDetection = (student) => {

        setDetected(prev => {

            const exists = prev.find(s => s.id === student.id)

            if (exists) return prev

            return [...prev, student]

        })

        updateStudent(student.id, "present")
    }

    const handleSessionSelect = (session) => {
        setSelectedSession(session)
        setStep("method")
    }

    const handleMethodSelect = async (m) => {

        setMethod(m)

        await startSession(m)

        setStep("attendance")
    }

    return (

        <div className="p-6">

            <h1 className="text-2xl font-semibold mb-6">
                Attendance Management
            </h1>

            {/* SESSION LIST */}

            {step === "sessions" && (
                <SessionList
                    sessions={sessions}
                    onSelect={handleSessionSelect}
                />
            )}

            {/* METHOD SELECT */}

            {step === "method" && (
                <MethodSelector
                    session={selectedSession}
                    onSelect={handleMethodSelect}
                />
            )}

            {/* ATTENDANCE SCREEN */}

            {step === "attendance" && (

                <div>

                    <h2 className="text-lg font-semibold mb-4">
                        {selectedSession.subject} - {selectedSession.section}
                    </h2>

                    {/* CAMERA + LIVE PANEL */}

                    <div className="grid grid-cols-2 gap-4 mb-6">

                        {/* LEFT → CAMERA */}

                        <div>

                            {method === "face" && (
                                <AttendanceCamera
                                    onDetect={handleDetection}
                                />
                            )}

                            {method === "qr" && <QRScanner />}

                        </div>


                        {/* RIGHT → LIVE DETECTIONS */}

                        <LiveDetectedStudents detected={detected} />

                    </div>


                    {/* STUDENT LIST */}

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

                        <button className="bg-blue-600 text-white px-6 py-2 rounded">
                            Submit Attendance
                        </button>

                    </div>

                </div>

            )}

        </div>

    )
}