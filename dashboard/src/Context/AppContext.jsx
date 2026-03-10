import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {

    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [sections, setSections] = useState([]);

    const backendUrl = "http://localhost:8000/api/v1";

    //    GET STUDENTS

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

    //    GET TEACHERS

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

    //    GET SECTIONS

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

    //    LOAD DATA ON START

    useEffect(() => {

        getStudents();
        getTeachers();
        getSections();

    }, []);

    const value = {
        students,
        teachers,
        sections,
        getStudents,
        getTeachers,
        getSections
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );

};

export default AppContextProvider;