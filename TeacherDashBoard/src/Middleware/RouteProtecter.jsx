

import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const RouteProtecter = ({ children }) => {

    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {

        const checkAuth = async () => {

            try {

                const res = await axios.get(
                    "http://localhost:8000/api/v1/users/me",
                    { withCredentials: true }
                );

                if (res.data.success && res.data.user.role === "teacher") {
                    setIsAdmin(true);
                }

            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }

        };

        checkAuth();

    }, []);

    /* =========================
       LOADING SCREEN
    ========================= */

    if (loading) {

        return (

            <div className="flex items-center justify-center h-screen bg-gray-50">

                <div className="flex flex-col items-center gap-4">

                    {/* Spinner */}

                    <div className="w-12 h-12 border-4 border-blue-950 border-t-transparent rounded-full animate-spin"></div>

                    {/* Text */}

                    <p className="text-gray-600 font-medium">
                        Checking authentication...
                    </p>

                </div>

            </div>

        );

    }

    if (!isAdmin) return <Navigate to="/login" replace />;

    return children;

};

export default RouteProtecter;