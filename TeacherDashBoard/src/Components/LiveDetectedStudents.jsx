export default function LiveDetectedStudents({ detected }) {

    return (

        <div className="bg-white shadow rounded p-3 h-full">

            <h2 className="font-semibold mb-3">
                Live Attendance
            </h2>

            {detected.length === 0 && (
                <p className="text-gray-400 text-sm">
                    Waiting for detections...
                </p>
            )}

            <div className="space-y-3">

                {detected.map(student => (

                    <div
                        key={student.id}
                        className="flex items-center gap-3 border-b pb-2"
                    >

                        <img
                            src={student.face}
                            alt="face"
                            className="w-10 h-10 rounded object-cover"
                        />

                        <div>

                            <p className="text-sm font-medium">
                                {student.name}
                            </p>

                            <p className="text-xs text-green-600">
                                Present
                            </p>

                        </div>

                    </div>

                ))}

            </div>

        </div>

    )

}