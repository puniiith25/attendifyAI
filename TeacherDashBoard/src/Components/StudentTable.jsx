export default function StudentTable({ students = [], onUpdate }) {

    return (

        <div className="bg-white rounded shadow mt-6">

            <div className="grid grid-cols-4 px-6 py-3 text-sm font-semibold border-b">
                <p>#</p>
                <p>Student</p>
                <p>Status</p>
                <p>Action</p>
            </div>

            {students.map((student, index) => {

                const statusColor =
                    student.status === "present"
                        ? "text-green-600"
                        : "text-red-600"

                return (

                    <div
                        key={student.id}
                        className="grid grid-cols-4 px-6 py-3 border-b items-center"
                    >

                        <p>{index + 1}</p>

                        <div className="flex items-center gap-3">

                            <img
                                src={student.photo || "/avatar.png"}
                                className="w-10 h-10 rounded-full"
                            />

                            <div>

                                <p className="font-medium">
                                    {student.name}
                                </p>

                                {student.session_photo && (
                                    <img
                                        src={student.session_photo}
                                        className="w-8 h-8 mt-1 rounded"
                                    />
                                )}

                            </div>

                        </div>

                        <p className={`font-medium ${statusColor}`}>
                            {student.status}
                        </p>

                        <div className="flex gap-2">

                            <button
                                onClick={() => onUpdate(student.id, "present")}
                                className="px-3 py-1 bg-green-600 text-white rounded"
                            >
                                Present
                            </button>

                            <button
                                onClick={() => onUpdate(student.id, "absent")}
                                className="px-3 py-1 bg-red-600 text-white rounded"
                            >
                                Absent
                            </button>

                        </div>

                    </div>

                )

            })}

        </div>

    )

}