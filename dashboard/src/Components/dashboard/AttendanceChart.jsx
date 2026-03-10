import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

const data = [
    { day: "Jan 1", value: 85 },
    { day: "Jan 2", value: 88 },
    { day: "Jan 3", value: 82 },
    { day: "Jan 4", value: 89 },
    { day: "Jan 5", value: 86 },
    { day: "Jan 6", value: 91 },
    { day: "Jan 7", value: 88 }
]

const AttendanceChart = () => {

    return (

        <div className="bg-white border rounded-lg p-6">

            <h3 className="font-semibold mb-1">
                Attendance Trends
            </h3>

            <p className="text-sm text-gray-500 mb-4">
                Daily attendance rate over the past week
            </p>

            <ResponsiveContainer width="100%" height={450}>

                <LineChart data={data}>

                    <XAxis dataKey="day" />

                    <YAxis />

                    <Tooltip />

                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#1e3a8a"
                        strokeWidth={2}
                    />

                </LineChart>

            </ResponsiveContainer>

        </div>

    )

}

export default AttendanceChart