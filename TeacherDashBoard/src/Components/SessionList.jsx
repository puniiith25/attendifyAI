import { useMemo } from "react"

export default function SessionList({ sessions = [], onSelect }) {

    const today = new Date()
    const todayDay = today.getDay()

    const todaySessions = useMemo(() => {

        return sessions
            .filter(s => s.day_of_week === todayDay)
            .sort((a, b) => a.period_no - b.period_no)

    }, [sessions, todayDay])

    return (

        <div>

            <h2 className="text-xl font-semibold mb-4">
                Today's Classes
            </h2>

            {todaySessions.length === 0 && (
                <p className="text-gray-400">
                    No classes scheduled today
                </p>
            )}

            <div className="grid gap-4">

                {todaySessions.map(session => (

                    <div
                        key={session.id}
                        onClick={() => onSelect(session)}
                        className="bg-white p-4 shadow rounded cursor-pointer hover:shadow-md"
                    >

                        <h2 className="font-semibold text-lg">
                            {session.subject}
                        </h2>

                        <p className="text-gray-500">
                            Section: {session.section}
                        </p>

                        <p className="text-gray-400 text-sm">
                            Period {session.period_no}
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