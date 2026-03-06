import express from "express";
import {
    createSubject,
    getAllSubjects,
    getTeacherSubjects,
    getStudentSubjects
} from "../Controllers/subjectController.js";

import { verifyToken } from "../Midddlewares/verifyToken.js";

const subjectRouter = express.Router();

subjectRouter.post("/createSubject", verifyToken, createSubject);

subjectRouter.get("/getAllSubjects", verifyToken, getAllSubjects);

subjectRouter.get("/getTeacherSubjects", verifyToken, getTeacherSubjects);

subjectRouter.get("/getStudentSubjects", verifyToken, getStudentSubjects);

export default subjectRouter;