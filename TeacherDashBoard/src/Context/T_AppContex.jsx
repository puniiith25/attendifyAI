import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const T_AppContext = createContext();

const T_AppContextProvider = ({ children }) => {

    const [timetable, setTimetable] = useState([]);

    const backendUrl = "http://localhost:8000/api/v1";




    const getTimetable = async () => {

        try {

            const res = await axios.get(
                `${backendUrl}/timetable/teacher-timetable`,
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

        getTimetable();

    }, []);


    const value = {

        timetable,

        getTimetable

    };

    return (
        <T_AppContext.Provider value={value}>
            {children}
        </T_AppContext.Provider>
    );

};

export default T_AppContextProvider;