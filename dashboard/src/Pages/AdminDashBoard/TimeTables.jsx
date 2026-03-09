import React, { useState } from "react"
import { ChevronDown } from "lucide-react"

import {
    sections,
    timetableData
} from "../../assets/TimetableData"

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

const periods = [
    { no: 1, start: "09:00", end: "10:00" },
    { no: 2, start: "10:10", end: "11:00" },
    { no: 3, start: "11:10", end: "12:00" },
    { no: 4, start: "12:10", end: "13:00" },
    { no: 5, start: "14:00", end: "15:00" },
    { no: 6, start: "15:10", end: "16:00" }
]

const TimeTables = () => {

    const [section, setSection] = useState(sections[0].id)
    const [month, setMonth] = useState("2026-04")
    const [view, setView] = useState("week")

    const getClass = (day, period) => {

        return timetableData.find(
            t =>
                t.section_id === section &&
                t.day === day &&
                t.period_no === period
        )

    }

    return (

        <div className="border rounded border-gray-300 p-6">

            <h1 className="text-2xl font-semibold">
                Timetable Management
            </h1>

            <p className="text-gray-500 mb-6">
                View timetable by section and month
            </p>

            <div className="flex gap-4 mb-6">

                <div className="w-[220px] relative">

                    <select
                        value={section}
                        onChange={(e) => setSection(Number(e.target.value))}
                        className="w-full bg-gray-200 p-2 rounded appearance-none outline-none"
                    >

                        {sections.map(sec => (
                            <option key={sec.id} value={sec.id}>
                                {sec.sec_name}
                            </option>
                        ))}

                    </select>

                    <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-gray-600" />

                </div>

                <input
                    type="month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="border p-2 rounded"
                />

                <div className="flex gap-2">

                    <button
                        onClick={() => setView("week")}
                        className={`px-3 py-1 rounded ${view === "week"
                            ? "bg-blue-950 text-white"
                            : "bg-gray-200"
                            }`}
                    >
                        Week
                    </button>

                    <button
                        onClick={() => setView("day")}
                        className={`px-3 py-1 rounded ${view === "day"
                            ? "bg-blue-950 text-white"
                            : "bg-gray-200"
                            }`}
                    >
                        Day
                    </button>

                </div>

            </div>

            <div className="overflow-x-auto">

                <table className="w-full border-collapse">

                    <thead>

                        <tr className="bg-gray-100">

                            <th className="border p-3 text-left w-[120px]">
                                Day
                            </th>

                            {periods.map(p => (
                                <th key={p.no} className="border p-3 text-center">

                                    <div className="text-sm font-semibold">
                                        Period {p.no}
                                    </div>

                                    <div className="text-xs text-gray-500">
                                        {p.start} - {p.end}
                                    </div>

                                </th>
                            ))}

                        </tr>

                    </thead>

                    <tbody>

                        {days.map(day => (
                            <tr key={day}>

                                <td className="border p-3 font-semibold bg-gray-50">
                                    {day}
                                </td>

                                {periods.map(p => {

                                    const cls = getClass(day, p.no)

                                    return (

                                        <td key={p.no} className="border p-2 text-center">

                                            {cls ? (

                                                <div className="bg-indigo-100 rounded p-2 text-xs">

                                                    <div className="font-semibold">
                                                        {cls.subject}
                                                    </div>

                                                    <div className="text-gray-600">
                                                        {cls.teacher}
                                                    </div>

                                                    <div className="text-gray-500">
                                                        {cls.start_time} - {cls.end_time}
                                                    </div>

                                                    <div className="text-gray-500">
                                                        {cls.classroom}
                                                    </div>

                                                </div>

                                            ) : (

                                                <span className="text-gray-400 text-xs">
                                                    —
                                                </span>

                                            )}

                                        </td>

                                    )

                                })}

                            </tr>
                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    )

}

export default TimeTables