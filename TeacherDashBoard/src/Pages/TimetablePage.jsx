import React, { useContext, useMemo } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { T_AppContext } from "../Context/T_AppContex"

const T_TimetablePage = () => {

    const { timetable } = useContext(T_AppContext)

    const events = useMemo(() => {

        const allEvents = []

        timetable.forEach((t) => {

            const startDate = new Date(t.valid_from)
            const endDate = new Date(t.valid_to)

            for (
                let d = new Date(startDate);
                d <= endDate;
                d.setDate(d.getDate() + 1)
            ) {

                // match weekday
                if (d.getDay() === t.day_of_week) {

                    const dateStr = d.toISOString().split("T")[0]

                    allEvents.push({

                        id: `${t.id}-${dateStr}`,

                        title: `${t.subject} (${t.section})`,

                        start: `${dateStr}T${t.start_time}`,
                        end: `${dateStr}T${t.end_time}`,

                        extendedProps: {
                            classroom: t.classroom,
                            period: t.period_no
                        }

                    })

                }

            }

        })

        return allEvents

    }, [timetable])


    return (

        <div className="p-6 border rounded">

            <h1 className="text-2xl font-semibold mb-6">
                My Teaching Timetable
            </h1>

            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}

                initialView="timeGridWeek"

                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "timeGridWeek,timeGridDay"
                }}

                events={events}

                timeZone="Asia/Kolkata"

                slotMinTime="06:00:00"
                slotMaxTime="20:00:00"

                allDaySlot={false}

                height="auto"

                eventMinHeight={60}

                eventContent={(eventInfo) => {

                    const { classroom, period } = eventInfo.event.extendedProps

                    return (

                        <div className="text-xs">

                            <div className="font-semibold">
                                {eventInfo.event.title}
                            </div>

                            <div>
                                Period {period}
                            </div>

                            <div>
                                Room {classroom}
                            </div>

                        </div>

                    )

                }}
            />

        </div>

    )

}

export default T_TimetablePage