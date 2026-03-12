import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const T_AppContext = createContext();

const T_AppContextProvider = ({ children }) => {

    const [sections, setSections] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [timetable, setTimetable] = useState([]);

    const backendUrl = "http://localhost:8000/api/v1";


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



    useEffect(() => {

        getSections();
        getSubjects();
        getTimetable();

    }, []);


    const value = {

        sections,
        subjects,
        timetable,

        getSections,
        getSubjects,
        getTimetable

    };

    return (
        <T_AppContext.Provider value={value}>
            {children}
        </T_AppContext.Provider>
    );

};

export default T_AppContextProvider;