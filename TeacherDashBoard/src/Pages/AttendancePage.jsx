import React, { useState } from "react"

const AttendancePage = () => {

    const [mode, setMode] = useState(null)

    const [students, setStudents] = useState([
        { id: 1, name: "Rahul Sharma", status: "present" },
        { id: 2, name: "Priya Patel", status: "present" },
        { id: 3, name: "Amit Kumar", status: "absent" },
        { id: 4, name: "Sneha Reddy", status: "present" },
        { id: 5, name: "Vikram Singh", status: "absent" }
    ])

    const markAllPresent = () => {

        const updated = students.map(s => ({
            ...s,
            status: "present"
        }))

        setStudents(updated)

    }

    const changeStatus = (id, value) => {

        const updated = students.map(s =>
            s.id === id ? { ...s, status: value } : s
        )

        setStudents(updated)

    }

    return (

        <div className="p-6 bg-gray-50 min-h-screen">

            <h1 className="text-2xl font-semibold mb-6">
                Attendance Management
            </h1>

            {/* Top Cards */}

            <div className="grid grid-cols-3 gap-4 mb-6">

                {/* Face Attendance */}

                <div className="bg-white rounded shadow p-4">

                    <h2 className="font-semibold mb-3">
                        Face Recognition
                    </h2>

                    <div className="h-32 bg-gray-100 flex items-center justify-center rounded mb-3">
                        Camera Feed
                    </div>

                    <button
                        disabled={mode === "qr"}
                        onClick={() => setMode("face")}
                        className={`w-full py-2 rounded text-white ${mode === "face" ? "bg-green-600" : "bg-blue-600"
                            }`}
                    >
                        Start Face Attendance
                    </button>

                </div>

                {/* QR Attendance */}

                <div className="bg-white rounded shadow p-4">

                    <h2 className="font-semibold mb-3">
                        QR Attendance
                    </h2>

                    <div className="h-32 bg-gray-100 flex items-center justify-center rounded mb-3">
                        QR Code
                    </div>

                    <button
                        disabled={mode === "face"}
                        onClick={() => setMode("qr")}
                        className={`w-full py-2 rounded text-white ${mode === "qr" ? "bg-green-600" : "bg-blue-600"
                            }`}
                    >
                        Generate QR
                    </button>

                </div>

                {/* Summary */}

                <div className="bg-white rounded shadow p-4">

                    <h2 className="font-semibold mb-3">
                        Today's Summary
                    </h2>

                    <p>
                        Present: {students.filter(s => s.status === "present").length}
                    </p>

                    <p>
                        Absent: {students.filter(s => s.status === "absent").length}
                    </p>

                </div>

            </div>

            {/* Student List */}

            <div className="bg-white rounded shadow">

                <div className="p-4 border-b font-semibold">
                    Student Attendance - CSE Section A
                </div>

                <table className="w-full">

                    <thead className="bg-gray-100">

                        <tr className="text-left">

                            <th className="p-3">Roll</th>
                            <th className="p-3">Student Name</th>
                            <th className="p-3">Manual Attendance</th>

                        </tr>

                    </thead>

                    <tbody>

                        {students.map((s, index) => {

                            const color =
                                s.status === "present"
                                    ? "bg-green-50"
                                    : "bg-red-50"

                            return (

                                <tr key={s.id} className={`${color} border-t`}>

                                    <td className="p-3">
                                        {index + 1}
                                    </td>

                                    <td className="p-3">
                                        {s.name}
                                    </td>

                                    <td className="p-3">

                                        <select
                                            value={s.status}
                                            onChange={(e) => changeStatus(s.id, e.target.value)}
                                            className="border rounded px-2 py-1"
                                        >

                                            <option value="present">Present</option>
                                            <option value="absent">Absent</option>

                                        </select>

                                    </td>

                                </tr>

                            )

                        })}

                    </tbody>

                </table>

            </div>

            {/* Bottom Buttons */}

            <div className="flex justify-end gap-4 mt-4">

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

    )

}

export default AttendancePage