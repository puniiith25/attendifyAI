import React, { useEffect, useState } from "react"
import axios from "axios"
import { Calendar, Users, ChevronLeft, Check, X, User, ArrowLeft, ClipboardList } from "lucide-react"

const TReportPage = () => {
    const [sessions, setSessions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    // Editing State
    const [selectedSession, setSelectedSession] = useState(null)
    const [students, setStudents] = useState([])
    const [loadingStudents, setLoadingStudents] = useState(false)

    useEffect(() => {
        fetchHistory()
    }, [])

    const fetchHistory = async () => {
        try {
            setLoading(true)
            const res = await axios.get(
                "http://localhost:8000/api/v1/attendance/session/history",
                { withCredentials: true }
            )
            if (res.data && res.data.success) {
                setSessions(res.data.sessions)
            } else {
                setError(true)
            }
        } catch (err) {
            console.error("Failed to load history:", err)
            setError(true)
        } finally {
            setLoading(false)
        }
    }

    const handleSelectSession = async (session) => {
        setSelectedSession(session)
        setLoadingStudents(true)
        try {
            const res = await axios.get(
                `http://localhost:8000/api/v1/attendance/session/${session.id}/details`,
                { withCredentials: true }
            )
            if (res.data && res.data.success) {
                const formatted = (res.data.students || []).map(s => ({
                    id: s.id,
                    name: s.name,
                    photo: s.student_photo,
                    session_photo: s.capture_image,
                    confidence: s.confidence,
                    status: s.status || "absent"
                }))
                setStudents(formatted)
            }
        } catch (err) {
            console.error("Failed to load session details:", err)
            alert("Error loading student details")
        } finally {
            setLoadingStudents(false)
        }
    }

    const handleUpdateStatus = async (studentId, newStatus) => {
        // Optimistic UI update
        setStudents(prev =>
            prev.map(s => (s.id === studentId ? { ...s, status: newStatus } : s))
        )

        try {
            await axios.post(
                "http://localhost:8000/api/v1/attendance/manual",
                {
                    session_id: selectedSession.id,
                    student_id: studentId,
                    status: newStatus
                },
                { withCredentials: true }
            )

            // Update stats in the main session history list in the background
            setSessions(prev =>
                prev.map(sess => {
                    if (sess.id === selectedSession.id) {
                        const wasPresent = students.find(s => s.id === studentId)?.status === "present"
                        const isNowPresent = newStatus === "present"
                        let change = 0
                        if (!wasPresent && isNowPresent) change = 1
                        if (wasPresent && !isNowPresent) change = -1

                        return {
                            ...sess,
                            present_count: sess.present_count + change
                        }
                    }
                    return sess
                })
            )
        } catch (err) {
            console.error("Failed to update status:", err)
            alert("Database write failed. Could not save manual change.")
            // Rollback UI update
            const oldStatus = newStatus === "present" ? "absent" : "present"
            setStudents(prev =>
                prev.map(s => (s.id === studentId ? { ...s, status: oldStatus } : s))
            )
        }
    }

    if (loading) {
        return (
            <div className="p-8 space-y-6 animate-pulse">
                <div className="h-10 bg-slate-200 rounded-lg w-1/4"></div>
                <div className="space-y-4">
                    <div className="h-20 bg-slate-200 rounded-2xl"></div>
                    <div className="h-20 bg-slate-200 rounded-2xl"></div>
                    <div className="h-20 bg-slate-200 rounded-2xl"></div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-8">
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 flex items-center gap-4 text-rose-800 shadow-sm max-w-2xl">
                    <AlertCircle className="w-10 h-10 text-rose-600 flex-shrink-0" />
                    <div>
                        <h3 className="font-semibold text-lg">Connection Error</h3>
                        <p className="text-sm text-rose-700 mt-0.5">
                            Could not load attendance history. Make sure the backend server is running.
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            {!selectedSession ? (
                <>
                    {/* View 1: History List */}
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                            Attendance History
                        </h1>
                        <p className="text-slate-500 font-medium mt-1">
                            Review and correct attendance sheets for previous and current academic days.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        {sessions.length === 0 ? (
                            <div className="p-16 text-center text-slate-400 font-medium flex flex-col items-center gap-3">
                                <ClipboardList className="w-12 h-12 text-slate-300" />
                                <span>No conducted sessions found in your history.</span>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {sessions.map((session) => {
                                    const ratio = session.total_count ? (session.present_count / session.total_count) * 100 : 0
                                    const dateFormatted = new Date(session.class_date).toLocaleDateString("en-US", {
                                        weekday: "short",
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric"
                                    })

                                    return (
                                        <div
                                            key={session.id}
                                            onClick={() => handleSelectSession(session)}
                                            className="px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 cursor-pointer transition-all duration-150"
                                        >
                                            <div className="space-y-1">
                                                <h3 className="text-lg font-bold text-slate-800">
                                                    {session.subject_name}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 font-medium">
                                                    <span>Section: {session.section_name}</span>
                                                    <span className="hidden md:inline text-slate-300">•</span>
                                                    <span>Period {session.period_no}</span>
                                                    <span className="hidden md:inline text-slate-300">•</span>
                                                    <span className="inline-flex items-center gap-1">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {dateFormatted}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-6 flex-shrink-0">
                                                <div className="text-right space-y-1">
                                                    <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">
                                                        Attendance
                                                    </p>
                                                    <p className="text-lg font-extrabold text-slate-800">
                                                        {session.present_count} / {session.total_count} present
                                                    </p>
                                                </div>

                                                <div className="w-24 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${
                                                            ratio > 75 ? "bg-emerald-500" : ratio > 40 ? "bg-amber-500" : "bg-rose-500"
                                                        }`}
                                                        style={{ width: `${ratio}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <>
                    {/* View 2: Detailed Edit List */}
                    <div className="space-y-6">
                        {/* Back Button and Details */}
                        <div className="flex flex-col gap-4">
                            <button
                                onClick={() => setSelectedSession(null)}
                                className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-semibold text-sm w-fit transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to History
                            </button>

                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                                        {selectedSession.subject_name}
                                    </h1>
                                    <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-full font-bold uppercase border border-slate-200">
                                        Section {selectedSession.section_name}
                                    </span>
                                </div>
                                <p className="text-slate-500 font-medium mt-1">
                                    Editing attendance sheet conducted on{" "}
                                    {new Date(selectedSession.class_date).toLocaleDateString("en-US", {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric"
                                    })}{" "}
                                    for Period {selectedSession.period_no}.
                                </p>
                            </div>
                        </div>

                        {/* Student Grid */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                            {/* Table Header */}
                            <div className="grid grid-cols-12 px-6 py-4 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                                <div className="col-span-1">#</div>
                                <div className="col-span-6">Student Profile</div>
                                <div className="col-span-3 text-center">Status</div>
                                <div className="col-span-2 text-right">Actions</div>
                            </div>

                            {loadingStudents ? (
                                <div className="p-16 text-center text-slate-400 font-medium animate-pulse">
                                    Loading student list...
                                </div>
                            ) : students.length === 0 ? (
                                <div className="p-16 text-center text-slate-400 font-medium">
                                    No students enrolled in this section.
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {students.map((student, index) => {
                                        const isPresent = student.status === "present"

                                        return (
                                            <div
                                                key={student.id}
                                                className="grid grid-cols-12 px-6 py-4 items-center hover:bg-slate-50/50 transition-colors duration-150"
                                            >
                                                {/* Roll Index */}
                                                <div className="col-span-1 text-sm font-semibold text-slate-400">
                                                    {String(index + 1).padStart(2, "0")}
                                                </div>

                                                {/* Student Details */}
                                                <div className="col-span-6 flex items-center gap-3">
                                                    <div className="relative w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 overflow-hidden">
                                                        <User className="w-5 h-5 absolute" />
                                                        {student.photo && (
                                                            <img
                                                                src={student.photo}
                                                                alt={student.name}
                                                                className="w-full h-full object-cover absolute z-10"
                                                                onError={(e) => {
                                                                    e.target.style.display = "none"
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-800 text-sm">
                                                            {student.name}
                                                        </p>
                                                        <p className="text-xs text-slate-400 font-medium">
                                                            ID: {student.id}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Status Badges */}
                                                <div className="col-span-3 flex justify-center">
                                                    {isPresent ? (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                            Present
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-100">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                                            Absent
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Manual Toggle Buttons */}
                                                <div className="col-span-2 flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleUpdateStatus(student.id, "present")}
                                                        className={`p-2 rounded-xl transition-all duration-200 ${
                                                            isPresent
                                                                ? "bg-emerald-600 text-white shadow-sm"
                                                                : "bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                                                        }`}
                                                        title="Mark Present"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>

                                                    <button
                                                        onClick={() => handleUpdateStatus(student.id, "absent")}
                                                        className={`p-2 rounded-xl transition-all duration-200 ${
                                                            !isPresent
                                                                ? "bg-rose-600 text-white shadow-sm"
                                                                : "bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                                                        }`}
                                                        title="Mark Absent"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default TReportPage