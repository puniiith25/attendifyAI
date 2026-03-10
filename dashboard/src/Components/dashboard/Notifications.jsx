const notifications = [

    {
        title: "Timetable Updated",
        message: "CSE3 timetable has been updated for next week",
        level: "medium"
    },

    {
        title: "Low Attendance Alert",
        message: "Section ME2A has attendance below 75%",
        level: "high"
    }

]

const Notifications = () => {

    return (

        <div className="bg-white border rounded-lg p-6">

            <h3 className="font-semibold mb-4">
                Recent Notifications
            </h3>

            <div className="space-y-3">

                {notifications.map((n, i) => (

                    <div key={i} className="border rounded p-3">

                        <div className="flex justify-between">

                            <p className="font-medium">
                                {n.title}
                            </p>

                            <span className={`text-xs px-2 py-1 rounded
                                ${n.level === "high"
                                    ? "bg-red-100 text-red-600"
                                    : "bg-gray-100 text-gray-600"
                                }`}>

                                {n.level}

                            </span>

                        </div>

                        <p className="text-sm text-gray-500 mt-1">
                            {n.message}
                        </p>

                    </div>

                ))}

            </div>

        </div>

    )

}

export default Notifications