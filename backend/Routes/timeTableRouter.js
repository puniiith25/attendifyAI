import express from "express";
import { verifyToken, authorizeRole } from "../Midddlewares/verifyToken.js";

import {
    createTimetable,
    getAllTimetables,
    getTeacherTimetable,
    getStudentTimetable,
    updateTimetable,
    deleteTimetable
} from "../Controllers/timeTableController.js";

const timetableRouter = express.Router();

timetableRouter.post("/create-timetable", verifyToken, authorizeRole("admin"), createTimetable);

timetableRouter.get("/get-timetables", verifyToken, getAllTimetables);

timetableRouter.get("/teacher-timetable", verifyToken, authorizeRole("teacher"), getTeacherTimetable);

timetableRouter.get("/student-timetable", verifyToken, authorizeRole("student"), getStudentTimetable);

timetableRouter.put("/update-timetable/:id", verifyToken, authorizeRole("admin"), updateTimetable);

timetableRouter.delete("/delete-timetable/:id", verifyToken, authorizeRole("admin"), deleteTimetable);

export default timetableRouter;