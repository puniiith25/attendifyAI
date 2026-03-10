import { ChevronDown, X } from "lucide-react"
import React, { useState } from "react"

const AddTimeTable = ({ setshowAddTimeTable }) => {

    const [day, setDay] = useState("")
    const [period, setPeriod] = useState("")
    const [section, setSection] = useState("")
    const [teacher, setTeacher] = useState("")
    const [subject, setSubject] = useState("")
    const [classroom, setClassroom] = useState("")
    const [startTime, setStartTime] = useState("")
    const [endTime, setEndTime] = useState("")
    const [validFrom, setValidFrom] = useState("")
    const [validTo, setValidTo] = useState("")

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

    const sections = ["CSE-A", "CSE-B", "CSE-C"]

    const teachers = [
        "Dr. Sharma",
        "Prof. Rao",
        "Dr. Mehta"
    ]

    const subjects = [
        "Data Structures",
        "Database Systems",
        "Operating Systems",
        "Computer Networks"
    ]

    const classrooms = ["A101", "A102", "B201", "LAB1"]

    return (
        <div className="absolute inset-0 z-90 w-full h-full backdrop-blur-md grid">

            <div className="place-self-center w-[550px] border bg-white rounded-2xl p-10">

                <div className="flex justify-between mb-6">

                    <div>
                        <h1 className="font-semibold text-3xl text-blue-950">
                            Add Timetable
                        </h1>
                        <p className="text-gray-500">
                            Create new class schedule
                        </p>
                    </div>

                    <X
                        onClick={() => setshowAddTimeTable(false)}
                        className="cursor-pointer"
                    />

                </div>

                {/* Day */}
                <div className="mt-3">
                    <label className="font-semibold">Day of Week</label>

                    <select
                        value={day}
                        onChange={(e) => setDay(e.target.value)}
                        className="bg-gray-200 p-3 rounded w-full"
                    >
                        <option value="">Select Day</option>

                        {days.map((d, i) => (
                            <option key={i} value={d}>{d}</option>
                        ))}

                    </select>
                </div>


                {/* Period */}
                <div className="mt-3">
                    <label className="font-semibold">Period No</label>

                    <input
                        type="number"
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="bg-gray-200 p-3 rounded w-full"
                        placeholder="1"
                    />
                </div>


                {/* Section */}
                <div className="mt-3">
                    <label className="font-semibold">Section</label>

                    <select
                        value={section}
                        onChange={(e) => setSection(e.target.value)}
                        className="bg-gray-200 p-3 rounded w-full"
                    >

                        <option value="">Select Section</option>

                        {sections.map((s, i) => (
                            <option key={i} value={s}>{s}</option>
                        ))}

                    </select>
                </div>


                {/* Teacher */}
                <div className="mt-3">
                    <label className="font-semibold">Teacher</label>

                    <select
                        value={teacher}
                        onChange={(e) => setTeacher(e.target.value)}
                        className="bg-gray-200 p-3 rounded w-full"
                    >

                        <option value="">Select Teacher</option>

                        {teachers.map((t, i) => (
                            <option key={i} value={t}>{t}</option>
                        ))}

                    </select>
                </div>


                {/* Subject */}
                <div className="mt-3">
                    <label className="font-semibold">Subject</label>

                    <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="bg-gray-200 p-3 rounded w-full"
                    >

                        <option value="">Select Subject</option>

                        {subjects.map((s, i) => (
                            <option key={i} value={s}>{s}</option>
                        ))}

                    </select>
                </div>


                {/* Classroom */}
                <div className="mt-3">
                    <label className="font-semibold">Classroom</label>

                    <select
                        value={classroom}
                        onChange={(e) => setClassroom(e.target.value)}
                        className="bg-gray-200 p-3 rounded w-full"
                    >

                        <option value="">Select Room</option>

                        {classrooms.map((c, i) => (
                            <option key={i} value={c}>{c}</option>
                        ))}

                    </select>
                </div>


                {/* Time */}
                <div className="flex gap-4 mt-3">

                    <div className="w-full">
                        <label className="font-semibold">Start Time</label>

                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="bg-gray-200 p-3 rounded w-full"
                        />
                    </div>

                    <div className="w-full">
                        <label className="font-semibold">End Time</label>

                        <input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="bg-gray-200 p-3 rounded w-full"
                        />
                    </div>

                </div>


                {/* Date Range */}
                <div className="flex gap-4 mt-3">

                    <div className="w-full">
                        <label className="font-semibold">From</label>

                        <input
                            type="date"
                            value={validFrom}
                            onChange={(e) => setValidFrom(e.target.value)}
                            className="bg-gray-200 p-3 rounded w-full"
                        />
                    </div>

                    <div className="w-full">
                        <label className="font-semibold">To</label>

                        <input
                            type="date"
                            value={validTo}
                            onChange={(e) => setValidTo(e.target.value)}
                            className="bg-gray-200 p-3 rounded w-full"
                        />
                    </div>

                </div>


                {/* Buttons */}
                <div className="flex justify-end gap-4 mt-8">

                    <button
                        onClick={() => setshowAddTimeTable(false)}
                        className="bg-gray-200 px-6 py-2 rounded-lg"
                    >
                        Cancel
                    </button>

                    <button
                        className="bg-blue-950 text-white px-6 py-2 rounded-lg"
                    >
                        + Add Timetable
                    </button>

                </div>

            </div>

        </div>
    )
}

export default AddTimeTable