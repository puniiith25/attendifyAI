import express from "express";
import { verifyToken } from "../Midddlewares/verifyToken.js";

import {
    startAttendanceSession,
    markAttendance,
    getAllAttendance,
    getTeacherAttendance,
    getStudentAttendance
} from "../Controllers/SessionController.js";

const AttendenceRouter = express.Router();

// teacher starts attendance session
AttendenceRouter.post("/start", verifyToken, startAttendanceSession);

// mark attendance
AttendenceRouter.post("/mark", verifyToken, markAttendance);

// admin view all attendance
AttendenceRouter.get("/admin", verifyToken, getAllAttendance);

// teacher view their attendance
AttendenceRouter.get("/teacher", verifyToken, getTeacherAttendance);

// student view their attendance
AttendenceRouter.get("/student", verifyToken, getStudentAttendance);

export default AttendenceRouter;
