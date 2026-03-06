import express from "express";

import {
    createTimetable,
    getAllTimetables,
    getTeacherTimetable,
    getStudentTimetable
} from "../Controllers/timeTableController.js";
import { verifyToken } from "../Midddlewares/verifyToken.js";



const timetableRouter = express.Router();

timetableRouter.post("/createTimetable", verifyToken, createTimetable);

timetableRouter.get("/getAllTimetables", verifyToken, getAllTimetables);

timetableRouter.get("/getTeacherTimetable", verifyToken, getTeacherTimetable);

timetableRouter.get("/getStudentTimetable", verifyToken, getStudentTimetable);

export default timetableRouter;