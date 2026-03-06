import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import dotenv from "dotenv";

import "./Database/db.js";

import userRoutes from "./Routes/userRouters.js";
import sectionRoutes from "./Routes/sectionRouter.js";
import teacherRoutes from "./Routes/teacherRouter.js";
import studentRoutes from "./Routes/studentRouter.js";
import classroomRoutes from "./Routes/classRoomRouter.js";
import timetableRoutes from "./Routes/timeTableRouter.js";
import subjectRoutes from "./Routes/subjectRouter.js";
import attendanceRoutes from "./Routes/sessionRouter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;


//    GLOBAL MIDDLEWARE

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(helmet());


//  HEALTH CHECK

app.get("/", (req, res) => {
    res.json({
        status: "success",
        message: "API running"
    });
});


//    API ROUTES

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/sections", sectionRoutes);
app.use("/api/v1/teachers", teacherRoutes);
app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/classrooms", classroomRoutes);
app.use("/api/v1/timetable", timetableRoutes);
app.use("/api/v1/subjects", subjectRoutes);
app.use("/api/v1/attendance", attendanceRoutes);


//    GLOBAL ERROR HANDLER

app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
});


//    SERVER START

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});