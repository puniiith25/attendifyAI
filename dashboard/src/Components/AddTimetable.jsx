import { X } from "lucide-react"
import React, { useState, useContext } from "react"
import axios from "axios"
import { AppContext } from "../Context/AppContext"

const AddTimeTable = ({ setshowAddTimeTable }) => {

    const { sections, teachers, subjects, classrooms, getTimetable } =
        useContext(AppContext)

    const backendUrl = "http://localhost:8000/api/v1"

    const [day, setDay] = useState("")
    const [period, setPeriod] = useState("")
    const [section, setSection] = useState("")
    const [teacher, setTeacher] = useState("")
    const [subject, setSubject] = useState("")
    const [classroom, setClassroom] = useState("")
    const [startTime, setStartTime] = useState("")
    const [endTime, setEndTime] = useState("")
    const [semester, setSemester] = useState("")
    const [academicYear, setAcademicYear] = useState("")
    const [validFrom, setValidFrom] = useState("")
    const [validTo, setValidTo] = useState("")

    const days = [
        { name: "Monday", id: 1 },
        { name: "Tuesday", id: 2 },
        { name: "Wednesday", id: 3 },
        { name: "Thursday", id: 4 },
        { name: "Friday", id: 5 },
        { name: "Saturday", id: 6 }
    ]

    const semesters = [1, 2, 3, 4, 5, 6, 7, 8]


    /* =============================
       CREATE TIMETABLE
    ============================= */

    const handleSubmit = async () => {

        if (
            !day || !period || !section || !teacher || !subject ||
            !classroom || !startTime || !endTime || !semester ||
            !academicYear || !validFrom || !validTo
        ) {
            alert("Please fill all fields")
            return
        }

        if (startTime >= endTime) {
            alert("Start time must be before end time")
            return
        }

        const payload = {
            section_id: Number(section),
            subject_id: Number(subject),
            teacher_id: Number(teacher),
            classroom_id: Number(classroom),

            day_of_week: Number(day),
            period_no: Number(period),

            start_time: startTime,
            end_time: endTime,

            semester: Number(semester),
            academic_year: academicYear,

            valid_from: validFrom,
            valid_to: validTo
        }

        console.log("Sending:", payload)

        try {

            const res = await axios.post(
                `${backendUrl}/timetable/create-timetable`,
                payload,
                { withCredentials: true }
            )

            if (res.data.success) {
                alert("Timetable created")
                getTimetable()
                setshowAddTimeTable(false)
            }

        } catch (error) {
            console.log(error)
            alert(error?.response?.data?.message || "Error creating timetable")
        }
    }


    return (

        <div className="absolute inset-0 z-50 backdrop-blur-md flex items-center justify-center">

            <div className="w-[550px] bg-white rounded-2xl p-8">

                {/* HEADER */}
                <div className="flex justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-blue-950">
                            Add Timetable
                        </h1>
                        <p className="text-gray-500">
                            Create new class schedule
                        </p>
                    </div>

                    <X
                        className="cursor-pointer"
                        onClick={() => setshowAddTimeTable(false)}
                    />
                </div>


                {/* DAY */}

                <label className="font-semibold">Day</label>

                <select
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    className="bg-gray-200 p-3 rounded w-full mb-3"
                >
                    <option value="">Select Day</option>

                    {days.map((d) => (
                        <option key={d.id} value={d.id}>
                            {d.name}
                        </option>
                    ))}
                </select>


                {/* PERIOD */}

                <label className="font-semibold">Period</label>

                <input
                    type="number"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="bg-gray-200 p-3 rounded w-full mb-3"
                />


                {/* SECTION */}

                <label className="font-semibold">Section</label>

                <select
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="bg-gray-200 p-3 rounded w-full mb-3"
                >
                    <option value="">Select Section</option>

                    {sections.map((sec) => (
                        <option key={sec.id} value={sec.id}>
                            {sec.sec_name}
                        </option>
                    ))}
                </select>


                {/* SUBJECT */}

                <label className="font-semibold">Subject</label>

                <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="bg-gray-200 p-3 rounded w-full mb-3"
                >
                    <option value="">Select Subject</option>

                    {subjects.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                            {sub.name}
                        </option>
                    ))}
                </select>


                {/* TEACHER */}

                <label className="font-semibold">Teacher</label>

                <select
                    value={teacher}
                    onChange={(e) => setTeacher(e.target.value)}
                    className="bg-gray-200 p-3 rounded w-full mb-3"
                >
                    <option value="">Select Teacher</option>

                    {teachers.map((t) => (
                        <option key={t.teacher_id} value={t.teacher_id}>
                            {t.name}
                        </option>
                    ))}
                </select>


                {/* CLASSROOM */}

                <label className="font-semibold">Classroom</label>

                <select
                    value={classroom}
                    onChange={(e) => setClassroom(e.target.value)}
                    className="bg-gray-200 p-3 rounded w-full mb-3"
                >
                    <option value="">Select Classroom</option>

                    {classrooms.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.room_number}
                        </option>
                    ))}
                </select>


                {/* SEMESTER */}

                <label className="font-semibold">Semester</label>

                <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="bg-gray-200 p-3 rounded w-full mb-3"
                >
                    <option value="">Select Semester</option>

                    {semesters.map((sem) => (
                        <option key={sem} value={sem}>
                            {sem}
                        </option>
                    ))}
                </select>


                {/* ACADEMIC YEAR */}

                <label className="font-semibold">Academic Year</label>

                <input
                    type="text"
                    placeholder="2025-2026"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="bg-gray-200 p-3 rounded w-full mb-3"
                />


                {/* VALID FROM */}

                <label className="font-semibold">Valid From</label>

                <input
                    type="date"
                    value={validFrom}
                    onChange={(e) => setValidFrom(e.target.value)}
                    className="bg-gray-200 p-3 rounded w-full mb-3"
                />


                {/* VALID TO */}

                <label className="font-semibold">Valid To</label>

                <input
                    type="date"
                    value={validTo}
                    onChange={(e) => setValidTo(e.target.value)}
                    className="bg-gray-200 p-3 rounded w-full mb-3"
                />


                {/* TIME */}

                <div className="flex gap-4 mt-4">

                    <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="bg-gray-200 p-3 rounded w-full"
                    />

                    <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="bg-gray-200 p-3 rounded w-full"
                    />

                </div>


                {/* BUTTONS */}

                <div className="flex justify-end gap-4 mt-6">

                    <button
                        onClick={() => setshowAddTimeTable(false)}
                        className="bg-gray-300 px-6 py-2 rounded"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        className="bg-blue-950 text-white px-6 py-2 rounded"
                    >
                        Add Timetable
                    </button>

                </div>

            </div>

        </div>
    )
}

export default AddTimeTable