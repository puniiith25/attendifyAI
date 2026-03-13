export default function StudentTable({ students, onUpdate }) {

    return (

        <div className="overflow-x-auto">

            <table className="w-full border rounded-lg">

                {/* ================= HEADER ================= */}

                <thead className="bg-gray-100">

                    <tr>

                        <th className="p-3 text-left">S.No</th>
                        <th className="p-3 text-left">Student Photo</th>
                        <th className="p-3 text-left">Session Capture</th>
                        <th className="p-3 text-left">Name</th>
                        <th className="p-3 text-center">Attendance</th>

                    </tr>

                </thead>

                {/* ================= BODY ================= */}

                <tbody>

                    {students.map((student, index) => {

                        const rowColor =
                            student.status === "present"
                                ? "bg-green-50"
                                : "bg-red-50";

                        return (

                            <tr
                                key={student.id}
                                className={`${rowColor} border-t`}
                            >

                                {/* Serial Number */}
                                <td className="p-3 font-medium">
                                    {index + 1}
                                </td>

                                {/* Student Photo */}
                                <td className="p-3">

                                    <img
                                        src={student.photo}
                                        alt="student"
                                        className="w-10 h-10 rounded-full object-cover"
                                    />

                                </td>

                                {/* Session Capture */}
                                <td className="p-3">

                                    {student.session_photo ? (

                                        <img
                                            src={student.session_photo}
                                            alt="session capture"
                                            className="w-10 h-10 rounded object-cover"
                                        />

                                    ) : (

                                        <span className="text-gray-400 text-sm">
                                            No Capture
                                        </span>

                                    )}

                                </td>

                                {/* Name */}
                                <td className="p-3 font-medium">
                                    {student.name}
                                </td>

                                {/* Attendance Buttons */}
                                <td className="p-3 text-center">

                                    <div className="flex justify-center gap-2">

                                        <button
                                            onClick={() => onUpdate(student.id, "present")}
                                            className={`px-3 py-1 rounded text-white ${student.status === "present"
                                                    ? "bg-green-600"
                                                    : "bg-gray-400"
                                                }`}
                                        >
                                            ✓
                                        </button>

                                        <button
                                            onClick={() => onUpdate(student.id, "absent")}
                                            className={`px-3 py-1 rounded text-white ${student.status === "absent"
                                                    ? "bg-red-600"
                                                    : "bg-gray-400"
                                                }`}
                                        >
                                            ✕
                                        </button>

                                    </div>

                                </td>

                            </tr>

                        );

                    })}

                </tbody>

            </table>

        </div>

    );

}