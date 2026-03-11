import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {

    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [sections, setSections] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [classRooms, setClassRooms] = useState([]);
    const [timetable, setTimetable] = useState([]);

    const backendUrl = "http://localhost:8000/api/v1";

    /* =============================
       GET STUDENTS
    ============================= */

    const getStudents = async () => {

        try {

            const res = await axios.get(
                `${backendUrl}/students/get-students`,
                { withCredentials: true }
            );

            if (res.data.success) {
                setStudents(res.data.students);
            }

        } catch (error) {
            console.log(error);
        }

    };


    /* =============================
       GET TEACHERS
    ============================= */

    const getTeachers = async () => {

        try {

            const res = await axios.get(
                `${backendUrl}/teachers/get-teachers`,
                { withCredentials: true }
            );

            if (res.data.success) {
                setTeachers(res.data.teachers);
            }

        } catch (error) {
            console.log(error);
        }

    };


    /* =============================
       GET SECTIONS
    ============================= */

    const getSections = async () => {

        try {

            const res = await axios.get(
                `${backendUrl}/sections/get-secs`,
                { withCredentials: true }
            );

            if (res.data.success) {
                setSections(res.data.sections);
            }

        } catch (error) {
            console.log(error);
        }

    };


    /* =============================
       GET SUBJECTS
    ============================= */

    const getSubjects = async () => {

        try {

            const res = await axios.get(
                `${backendUrl}/subjects/get-subjects`,
                { withCredentials: true }
            );

            if (res.data.success) {
                setSubjects(res.data.subjects);
            }

        } catch (error) {
            console.log(error);
        }

    };


    /* =============================
       GET CLASSROOMS
    ============================= */

    const getClassRooms = async () => {

        try {

            const res = await axios.get(
                `${backendUrl}/classrooms/get-classrooms`,
                { withCredentials: true }
            );

            if (res.data.success) {
                setClassRooms(res.data.classRooms);
            }

        } catch (error) {
            console.log(error);
        }

    };


    /* =============================
       GET TIMETABLE
    ============================= */

    const getTimetable = async () => {

        try {

            const res = await axios.get(
                `${backendUrl}/timetable/get-timetables`,
                { withCredentials: true }
            );

            if (res.data.success) {
                setTimetable(res.data.timetable);
            }

        } catch (error) {
            console.log(error);
        }

    };


    /* =============================
       LOAD DATA ON START
    ============================= */

    useEffect(() => {

        getStudents();
        getTeachers();
        getSections();
        getSubjects();
        getClassRooms();
        getTimetable();

    }, []);


    const value = {

        students,
        teachers,
        sections,
        subjects,
        classRooms,
        timetable,

        getStudents,
        getTeachers,
        getSections,
        getSubjects,
        getClassRooms,
        getTimetable

    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );

};

export default AppContextProvider;