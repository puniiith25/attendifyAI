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

timetableRouter.post("/create-timetable", verifyToken, createTimetable);

timetableRouter.get("/get-timetables", verifyToken, getAllTimetables);

timetableRouter.get("/teacher-timetable", verifyToken, getTeacherTimetable);

timetableRouter.get("/student-timetable", verifyToken, getStudentTimetable);

timetableRouter.put("/update-timetable/:id", verifyToken, updateTimetable);

timetableRouter.delete("/delete-timetable/:id", verifyToken, deleteTimetable);

export default timetableRouter;