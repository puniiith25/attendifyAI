export default function LiveDetectedStudents({ detected }) {

    return (

        <div className="bg-white p-4 rounded shadow h-[450px] overflow-y-auto">

            <h2 className="font-semibold text-lg mb-4">
                Live Detected Students
            </h2>

            {detected.length === 0 && (
                <p className="text-gray-400 text-sm">
                    No students detected yet
                </p>
            )}

            <div className="grid grid-cols-2 gap-3">

                {detected.map(student => {

                    const border =
                        student.confidence >= 0.60
                            ? "border-green-500"
                            : "border-red-500"

                    return (

                        <div
                            key={student.id}
                            className={`flex items-center gap-3 p-2 rounded border-2 ${border}`}
                        >

                            <img
                                src={`data:image/jpeg;base64,${student.crop}`}
                                alt="face"
                                className="w-12 h-12 rounded object-cover"
                            />

                            <div>

                                <p className="text-sm font-medium">
                                    ID: {student.id}
                                </p>

                                <p className="text-xs text-gray-500">
                                    {(student.confidence * 100).toFixed(1)}%
                                </p>

                            </div>

                        </div>

                    )

                })}

            </div>

        </div>

    )

}