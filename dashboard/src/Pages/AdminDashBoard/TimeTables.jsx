import React, { useState } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"

import { sections, timetableData } from "../../assets/TimetableData"

const generateEvents = (timetable, section) => {

    const events = []

    timetable
        .filter(t => t.section_id === section)
        .forEach(t => {

            let current = new Date(t.valid_from)
            const end = new Date(t.valid_to)

            while (current <= end) {

                if (current.getDay() === t.day_of_week) {

                    const date = current.toISOString().split("T")[0]

                    events.push({
                        title: `${t.subject} (${t.teacher})`,
                        start: `${date}T${t.start_time}`,
                        end: `${date}T${t.end_time}`
                    })

                }

                current.setDate(current.getDate() + 1)
            }

        })

    return events
}

const TimeTables = () => {

    const [section, setSection] = useState(sections[0].id)

    const events = generateEvents(timetableData, section)

    return (

        <div className="p-6 border rounded">

            <h1 className="text-2xl font-semibold mb-4">
                Timetable
            </h1>

            <select
                value={section}
                onChange={(e) => setSection(Number(e.target.value))}
                className="border p-2 mb-4 rounded"
            >

                {sections.map(sec => (
                    <option key={sec.id} value={sec.id}>
                        {sec.sec_name}
                    </option>
                ))}

            </select>

            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay"
                }}
                events={events}
                timeZone="Asia/Kolkata"
                slotMinTime="08:00:00"
                slotMaxTime="17:00:00"
                height="auto"
            />

        </div>

    )

}

export default TimeTables