import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Calendar, Users, TrendingUp, BookOpen, AlertCircle, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const TeacherDashBoard = () => {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:8000/api/v1/dashboard/teacher/data",
                    { withCredentials: true }
                )
                if (res.data && res.data.success) {
                    setStats(res.data)
                } else {
                    setError(true)
                }
            } catch (err) {
                console.error("Dashboard load error:", err)
                setError(true)
            } finally {
                setLoading(false)
            }
        }
        fetchDashboardData()
    }, [])

    if (loading) {
        return (
            <div className="p-8 space-y-6 animate-pulse">
                <div className="h-10 bg-slate-200 rounded-lg w-1/3"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="h-32 bg-slate-200 rounded-2xl"></div>
                    <div className="h-32 bg-slate-200 rounded-2xl"></div>
                    <div className="h-32 bg-slate-200 rounded-2xl"></div>
                </div>
                <div className="h-64 bg-slate-200 rounded-2xl mt-6"></div>
            </div>
        )
    }

    if (error || !stats) {
        return (
            <div className="p-8">
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 flex items-center gap-4 text-rose-800 shadow-sm max-w-2xl">
                    <AlertCircle className="w-10 h-10 text-rose-600 flex-shrink-0" />
                    <div>
                        <h3 className="font-semibold text-lg">Connection Error</h3>
                        <p className="text-sm text-rose-700 mt-0.5">
                            Could not connect to the backend server. Please verify that the local server is running on port 8000 and try again.
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            {/* Header Greeting */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                        Teacher Dashboard
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">
                        Welcome back! Here is today's overview of your academic slots.
                    </p>
                </div>
                <Link
                    to="/attendance"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm transition-all duration-150 transform hover:-translate-y-0.5"
                >
                    Start Attendance
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Scheduled Classes */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all duration-200 group">
                    <div className="p-4 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-200">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider">
                            Total Scheduled Classes
                        </p>
                        <h3 className="text-3xl font-extrabold text-slate-800 mt-1">
                            {stats.totalClasses}
                        </h3>
                    </div>
                </div>

                {/* Conducted Sessions */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all duration-200 group">
                    <div className="p-4 rounded-xl bg-sky-50 text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-colors duration-200">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider">
                            Sessions Tracked
                        </p>
                        <h3 className="text-3xl font-extrabold text-slate-800 mt-1">
                            {stats.totalSessions}
                        </h3>
                    </div>
                </div>

                {/* Avg Attendance */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all duration-200 group">
                    <div className="p-4 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-200">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider">
                            Avg Attendance Rate
                        </p>
                        <h3 className="text-3xl font-extrabold text-slate-800 mt-1">
                            {stats.avgAttendance}%
                        </h3>
                    </div>
                </div>
            </div>

            {/* Recent Sessions Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-slate-800 text-lg">
                        Recent Attendance Sessions
                    </h3>
                    <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                        Latest Activity
                    </span>
                </div>

                {stats.recentSessions.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 font-medium">
                        No attendance sessions conducted yet.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 font-bold text-xs uppercase tracking-wider border-b border-slate-100">
                                    <th className="px-6 py-4">Subject</th>
                                    <th className="px-6 py-4">Section</th>
                                    <th className="px-6 py-4">Period</th>
                                    <th className="px-6 py-4">Class Date</th>
                                    <th className="px-6 py-4">Verification Method</th>
                                    <th className="px-6 py-4">Attendance Stats</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700 text-sm font-medium">
                                {stats.recentSessions.map((session) => {
                                    const ratio = session.total_count ? (session.present_count / session.total_count) * 100 : 0
                                    const dateFormatted = new Date(session.class_date).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric"
                                    })
                                    const isOpen = session.session_status === "open"

                                    return (
                                        <tr key={session.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 text-slate-800 font-semibold">{session.subject_name}</td>
                                            <td className="px-6 py-4">{session.section_name}</td>
                                            <td className="px-6 py-4 text-slate-500">Period {session.period_no}</td>
                                            <td className="px-6 py-4 text-slate-500">{dateFormatted}</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 capitalize">
                                                    {session.method}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 max-w-[150px]">
                                                    <span className="text-slate-800 font-semibold flex-shrink-0">
                                                        {session.present_count} / {session.total_count}
                                                    </span>
                                                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                                        <div 
                                                            className={`h-full rounded-full ${
                                                                ratio > 75 ? 'bg-emerald-500' : ratio > 40 ? 'bg-amber-500' : 'bg-rose-500'
                                                            }`} 
                                                            style={{ width: `${ratio}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {isOpen ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                        Closed
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TeacherDashBoard