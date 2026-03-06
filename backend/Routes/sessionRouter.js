import express from "express";
import { verifyToken } from "../Midddlewares/verifyToken.js";

import {
    startAttendanceSession,
    markAttendance,
    getAllAttendance,
    getTeacherAttendance,
    getStudentAttendance
} from "../Controllers/SessionController.js";

const attendanceRouter = express.Router();

attendanceRouter.post("/start-session", verifyToken, startAttendanceSession);

attendanceRouter.post("/mark-attendance", verifyToken, markAttendance);

attendanceRouter.get("/admin-attendance", verifyToken, getAllAttendance);

attendanceRouter.get("/teacher-attendance", verifyToken, getTeacherAttendance);

attendanceRouter.get("/student-attendance", verifyToken, getStudentAttendance);

export default attendanceRouter;