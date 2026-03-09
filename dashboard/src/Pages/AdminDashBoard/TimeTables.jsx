import { ChevronDown } from 'lucide-react';
import React, { useState, useMemo, useEffect } from 'react';
import { ScheduleXCalendar, useCalendarApp } from "@schedule-x/react";
import { sections, eventsBySection } from '../../assets/TimetableData'
import {
    createViewWeek,
    createViewDay,
    createViewMonthAgenda,
} from "@schedule-x/calendar";
import '@schedule-x/theme-default/dist/index.css';
import "temporal-polyfill/global";
import { Temporal } from "temporal-polyfill";



const TimeTables = () => {
    const [section, setSection] = useState(sections[0]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    // Update selectedDate to first event's date when section changes
    useEffect(() => {
        const evts = eventsBySection[section] || [];
        if (evts.length > 0) {
            const firstEventDate = evts[0].start.split("T")[0];
            setSelectedDate(firstEventDate);
        }
    }, [section]);

    const eventList = useMemo(() => {
        const evts = eventsBySection[section] || [];
        return evts.map(e => ({
            id: e.id,
            title: `${e.title} — ${e.teacher} (${e.classroom})`,
            start: Temporal.ZonedDateTime.from(`${e.start}[Asia/Kolkata]`), // keep as Temporal object
            end: Temporal.ZonedDateTime.from(`${e.end}[Asia/Kolkata]`),     // keep as Temporal object
        }));
    }, [section]);

    const calendarApp = useCalendarApp({
        views: [
            createViewWeek({
                startHour: 8,   // 8 AM
                endHour: 18,    // 6 PM
            }),
            createViewDay({
                startHour: 8,
                endHour: 18,
            }),
            createViewMonthAgenda(),
        ],
        events: eventList,
    });


    return (
        <div className='border-2 rounded border-gray-300 p-5'>
            <h1 className='font-semibold text-2xl'>TimeTable Management</h1>
            <p className='text-gray-500'>Manage class schedules, assign teachers and classrooms</p>

            <div className='relative flex w-[30%] mt-5'>
                <div>
                    <label className='text-[20px] ml-1'>Section:</label>
                </div>
                <div className='border-0 p-1 pl-2 w-full rounded bg-gray-200 relative'>
                    <select
                        className='appearance-none outline-0 w-full cursor-pointer bg-gray-200'
                        value={section}
                        onChange={(e) => setSection(e.target.value)}
                    >
                        {sections.map((item, index) => (
                            <option key={index} value={item}>{item}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-2 text-gray-600 w-4 h-4 pointer-events-none" />
                </div>
            </div>

            <div className='mt-3 flex gap-2'>
                <label>Filter Start Date:</label>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className='border p-1 rounded'
                />
            </div>

            <div className="border rounded shadow mt-5">
                <ScheduleXCalendar calendarApp={calendarApp} />
            </div>
        </div>
    )
}

export default TimeTables;
