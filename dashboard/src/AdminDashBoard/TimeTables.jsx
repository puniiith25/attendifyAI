import React, { useState, useContext, useMemo } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"

import { AppContext } from "../../Context/AppContext"

const TimeTables = ({ setshowAddTimeTable }) => {

    const { timetable, sections } = useContext(AppContext)

    const [section, setSection] = useState("")

    /* =========================
       Convert timetable to events
    ========================= */

    const events = useMemo(() => {

        if (!section) return []

        const filtered = timetable.filter(
            t => t.section_id === Number(section)
        )

        const allEvents = []

        filtered.forEach((t) => {

            const start = new Date(t.valid_from)

            const end = t.valid_to
                ? new Date(t.valid_to)
                : new Date(new Date().setDate(new Date().getDate() + 90))

            const targetDay = t.day_of_week

            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {

                if (d.getDay() === targetDay) {

                    const dateStr = d.toLocaleDateString("en-CA", {
                        timeZone: "Asia/Kolkata"
                    })

                    allEvents.push({

                        id: `${t.id}-${dateStr}`,

                        title: t.subject,

                        start: `${dateStr}T${t.start_time}`,
                        end: `${dateStr}T${t.end_time}`,

                        extendedProps: {
                            teacher: t.teacher,
                            classroom: t.classroom
                        }

                    })

                }

            }

        })

        return allEvents

    }, [section, timetable])


    return (

        <div className="p-6 border rounded">

            {/* HEADER */}

            <div className='flex justify-between mb-10 mt-5'>

                <div>

                    <h1 className='font-semibold text-2xl'>
                        Time Tables Management
                    </h1>

                    <p className='text-gray-500'>
                        Manage Time Tables and academic information
                    </p>

                </div>

                <div className='rounded w-50 flex justify-center mt-4 p-4 bg-blue-950 text-white cursor-pointer'>

                    <button
                        type="button"
                        className='font-semibold'
                        onClick={() => setshowAddTimeTable(true)}
                    >
                        + Add Timetable
                    </button>

                </div>

            </div>


            {/* SECTION FILTER */}

            <select
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="border p-2 mb-4 rounded"
            >

                <option value="">Select Section</option>

                {sections.map(sec => (

                    <option key={sec.id} value={sec.id}>
                        {sec.sec_name}
                    </option>

                ))}

            </select>


            {/* CALENDAR */}

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

                    const { teacher, classroom } = eventInfo.event.extendedProps

                    return (

                        <div className="text-[11px] leading-tight">

                            <div className="font-semibold">
                                {eventInfo.event.title}
                            </div>

                            <div>
                                {teacher}
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

export default TimeTables