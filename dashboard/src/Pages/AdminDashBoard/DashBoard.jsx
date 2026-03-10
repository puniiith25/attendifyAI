

import StatCard from "../../Components/dashboard/StatCard"
import AttendanceChart from "../../Components/dashboard/AttendanceChart"
import Notifications from "../../Components/dashboard/Notifications"

import { Users, GraduationCap, Layers, BarChart } from "lucide-react"

const DashBoard = () => {

    return (

        <div className="p-6 space-y-6">

            <div>

                <h1 className="text-2xl font-semibold">
                    Dashboard
                </h1>

                <p className="text-gray-500">
                    Welcome to the Engineering College Admin Dashboard
                </p>

            </div>

            {/* Stat Cards */}

            <div className="grid grid-cols-5 gap-4">

                <StatCard
                    title="Total Students"
                    value="1,250"
                    change="+5.2% from last month"
                    subtitle="Active enrolled students"
                    icon={Users}
                />

                <StatCard
                    title="Total Teachers"
                    value="85"
                    change="+2.1%"
                    subtitle="Faculty members"
                    icon={GraduationCap}
                />

                <StatCard
                    title="Active Sections"
                    value="24"
                    change="0%"
                    subtitle="Currently running sections"
                    icon={Layers}
                />

                <StatCard
                    title="Attendance Rate"
                    value="82.5%"
                    change="+1.2%"
                    subtitle="Overall attendance"
                    icon={BarChart}
                />

                <StatCard
                    title="Pending Notifications"
                    value="8"
                    change="-12%"
                    subtitle="Require attention"
                    icon={Users}
                />

            </div>

            {/* Bottom Section */}

            <div className="grid grid-cols-3 gap-4">

                <div className="col-span-2">
                    <AttendanceChart />
                </div>

                <Notifications />

            </div>

        </div>

    )

}

export default DashBoard