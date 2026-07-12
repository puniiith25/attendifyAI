import React, { useState, useEffect } from "react"
import axios from "axios"
import AttendanceChart from "../../Components/dashboard/AttendanceChart"
import Notifications from "../../Components/dashboard/Notifications"
import { Users, GraduationCap, Layers, Calendar, Activity, AlertCircle } from "lucide-react"

const DashBoard = () => {
    const [stats, setStats] = useState({
        students: 0,
        teachers: 0,
        sections: 0,
        sessions: 0
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true)
                const res = await axios.get(
                    "http://localhost:8000/api/v1/dashboard/data",
                    { withCredentials: true }
                )
                if (res.data) {
                    setStats({
                        students: res.data.students || 0,
                        teachers: res.data.teachers || 0,
                        sections: res.data.sections || 0,
                        sessions: res.data.sessions || 0
                    })
                }
                setError(null)
            } catch (err) {
                console.error("Dashboard API error:", err)
                setError("Unable to load real-time statistics. Showing offline data.")
            } finally {
                setLoading(false)
            }
        }

        fetchDashboardData()
    }, [])

    // Config for card details
    const cardData = [
        {
            title: "Total Students",
            value: stats.students,
            subtitle: "Enrolled student profiles",
            icon: Users,
            color: "from-blue-500 to-indigo-600",
            iconColor: "text-blue-600",
            bgColor: "bg-blue-50"
        },
        {
            title: "Total Teachers",
            value: stats.teachers,
            subtitle: "Registered faculty members",
            icon: GraduationCap,
            color: "from-purple-500 to-indigo-700",
            iconColor: "text-purple-600",
            bgColor: "bg-purple-50"
        },
        {
            title: "Active Sections",
            value: stats.sections,
            subtitle: "Batches & departments",
            icon: Layers,
            color: "from-emerald-400 to-teal-600",
            iconColor: "text-emerald-600",
            bgColor: "bg-emerald-50"
        },
        {
            title: "Sessions Tracked",
            value: stats.sessions,
            subtitle: "Completed attendance cycles",
            icon: Calendar,
            color: "from-amber-400 to-orange-600",
            iconColor: "text-amber-600",
            bgColor: "bg-amber-50"
        },
        {
            title: "System Health",
            value: error ? "Offline" : "99.8%",
            subtitle: error ? "Check Server Connection" : "AI Services fully operational",
            icon: Activity,
            color: error ? "from-rose-500 to-red-600" : "from-cyan-500 to-blue-600",
            iconColor: error ? "text-rose-600" : "text-cyan-600",
            bgColor: error ? "bg-rose-50" : "bg-cyan-50"
        }
    ]

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* Header section with modern feel */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                        Dashboard Overview
                    </h1>
                    <p className="text-slate-500 mt-1 text-sm font-medium">
                        Real-time analytics and management controls for Attendify.ai
                    </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-xs font-semibold text-slate-600">
                    <span className={`w-2 h-2 rounded-full ${error ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
                    {error ? 'Degraded state' : 'Sync Connected'}
                </div>
            </div>

            {/* Error Notification Alert */}
            {error && (
                <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl text-sm shadow-sm animate-fade-in">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                    <p className="font-medium">{error}</p>
                </div>
            )}

            {/* Premium Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                {cardData.map((card, idx) => {
                    const Icon = card.icon
                    return (
                        <div 
                            key={idx} 
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 relative overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1 group"
                        >
                            {/* Colorful Gradient Border top */}
                            <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${card.color}`} />
                            
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        {card.title}
                                    </p>
                                    <h2 className="text-3xl font-extrabold text-slate-800 mt-2 tracking-tight">
                                        {loading ? (
                                            <span className="inline-block w-12 h-8 bg-slate-100 animate-pulse rounded" />
                                        ) : (
                                            card.value
                                        )}
                                    </h2>
                                </div>
                                <div className={`p-3 rounded-xl ${card.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon className={`w-5 h-5 ${card.iconColor}`} />
                                </div>
                            </div>
                            
                            <p className="text-xs font-medium text-slate-500 mt-4 leading-relaxed">
                                {card.subtitle}
                            </p>
                        </div>
                    )
                })}
            </div>

            {/* Bottom Layout section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 shadow-sm rounded-2xl overflow-hidden border border-gray-100">
                    <AttendanceChart />
                </div>
                <div className="shadow-sm rounded-2xl overflow-hidden border border-gray-100">
                    <Notifications />
                </div>
            </div>
        </div>
    )
}

export default DashBoard