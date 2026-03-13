import { useState, useMemo } from "react"

export default function SessionList({ sessions, onSelect }) {

    /* =========================
    DATE STATE
    ========================= */

    const [selectedDate, setSelectedDate] = useState(() => {
        return new Date()
    })

    /* =========================
    GET DAY NAME
    ========================= */

    const getDayName = (date) => {

        return date.toLocaleDateString("en-US", {
            weekday: "long"
        })

    }

    const selectedDay = getDayName(selectedDate)

    /* =========================
    FILTER SESSIONS BY DAY
    ========================= */

    const filteredSessions = useMemo(() => {

        return sessions.filter(
            (s) => s.day === selectedDay
        )

    }, [sessions, selectedDay])


    /* =========================
    DATE CHANGE
    ========================= */

    const handleDateChange = (e) => {

        const date = new Date(e.target.value)

        setSelectedDate(date)

    }


    return (

        <div>

            {/* =========================
      DATE SELECTOR
      ========================= */}

            <div className="mb-6">

                <label className="block text-sm font-medium mb-1">
                    Select Date
                </label>

                <input
                    type="date"
                    value={selectedDate.toISOString().split("T")[0]}
                    onChange={handleDateChange}
                    className="border rounded px-3 py-2"
                />

                <p className="text-gray-500 mt-1">
                    Day: {selectedDay}
                </p>

            </div>


            {/* =========================
      SESSION LIST
      ========================= */}

            <div className="grid gap-4">

                {filteredSessions.length === 0 && (

                    <p className="text-gray-400">
                        No sessions scheduled for this day
                    </p>

                )}


                {filteredSessions.map((session) => (

                    <div
                        key={session.id}
                        onClick={() => onSelect(session, selectedDate)}
                        className="bg-white p-4 shadow rounded cursor-pointer hover:shadow-md transition"
                    >

                        <h2 className="font-semibold text-lg">
                            {session.subject}
                        </h2>

                        <p className="text-gray-500">
                            Section: {session.section}
                        </p>

                        <p className="text-gray-400 text-sm">
                            {session.start_time} - {session.end_time}
                        </p>

                    </div>

                ))}

            </div>

        </div>

    )

}