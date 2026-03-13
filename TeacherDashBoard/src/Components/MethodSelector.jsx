export default function MethodSelector({ session, onSelect }) {

    if (!session) return null

    return (

        <div className="space-y-6">

            {/* =========================
            SESSION DETAILS
            ========================= */}

            <div className="bg-white p-4 rounded shadow">

                <h2 className="text-lg font-semibold mb-3">
                    Session Details
                </h2>

                <div className="grid grid-cols-2 gap-4 text-sm">

                    <p>
                        <span className="font-medium text-gray-600">
                            Section:
                        </span>{" "}
                        {session.section}
                    </p>

                    <p>
                        <span className="font-medium text-gray-600">
                            Subject:
                        </span>{" "}
                        {session.subject}
                    </p>

                    <p>
                        <span className="font-medium text-gray-600">
                            Teacher:
                        </span>{" "}
                        {session.teacher}
                    </p>

                    <p>
                        <span className="font-medium text-gray-600">
                            Period:
                        </span>{" "}
                        {session.period_no}
                    </p>

                </div>

            </div>


            {/* =========================
            METHOD SELECTION
            ========================= */}

            <div>

                <h2 className="text-lg font-semibold mb-4">
                    Choose Attendance Method
                </h2>

                <div className="flex gap-4">

                    <button
                        onClick={() => onSelect("face")}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
                    >
                        Face Recognition
                    </button>

                    <button
                        onClick={() => onSelect("qr")}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
                    >
                        QR Attendance
                    </button>

                    <button
                        onClick={() => onSelect("manual")}
                        className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded"
                    >
                        Manual
                    </button>

                </div>

            </div>

        </div>

    )

}