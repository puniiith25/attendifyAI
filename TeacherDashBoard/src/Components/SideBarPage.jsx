import React from "react";
import axios from 'axios'
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Bell, BookOpen, Calendar, ChartColumnDecreasing, Clock, GraduationCap, Home, HomeIcon, LogOut, LucideHome, Settings, Users } from 'lucide-react'
const SideBarItems = [
    { to: '/', label: 'DashBoard', Icon: Home },
    { to: '/attendance', label: 'Attendance', Icon: GraduationCap },
    { to: '/timetable', label: 'Timetable', Icon: Calendar },
    { to: '/reports', label: 'Reports', Icon: ChartColumnDecreasing },
    { to: '/notifications', label: 'Notifications', Icon: Bell },
    { to: '/settings', label: 'Settings', Icon: Settings }

]

function SidebarPage() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // call backend logout
            await axios.post("http://localhost:8000/api/v1/users/logout", {}, { withCredentials: true });
        } catch (error) {
            console.error("Logout backend call failed", error);
        } finally {
            // Always clear local state and redirect to login
            localStorage.clear();
            navigate("/login");
        }
    };

    return (
        <div className="fixed top-0 left-0  w-74 h-full bg-blue-950 text-white border-r border-gray-200 shadow-sm p-4 flex flex-col">
            <div className="pb-3 items-center flex flex-col border-b border-gray-600">
                <h1 className="font-semibold text-[20px]">College Admin</h1>
                <p>Engineering College</p>
            </div>
            <div className="pt-8 cursor-pointer">
                {SideBarItems.map((item, index) => (
                    <NavLink className={({ isActive }) => `flex gap-3  border-b border-gray-300 py-3 ${isActive ? "font-semibold text-white" : "text-gray-400"}`} key={index} to={item.to} end>
                        <item.Icon />
                        <h4>{item.label}</h4>
                    </NavLink>



                ))}

            </div>
            <div 
                onClick={handleLogout}
                className="mt-auto border-t border-gray-600 p-2 flex justify-center items-center gap-2 cursor-pointer text-gray-400 hover:text-white transition-colors duration-150"
            >
                <button className="text-lg font-medium" type="button">Logout</button>
                <LogOut className="w-5 h-5" />
            </div>
        </div>
    );
}

export default SidebarPage;
