import express from "express";
import {
    createSubject,
    getAllSubjects,
    getSubjectById,
    updateSubject,
    deleteSubject,
    getTeacherSubjects,
    getStudentSubjects
} from "../Controllers/subjectController.js";

import { verifyToken, authorizeRole } from "../Midddlewares/verifyToken.js";

const subjectRouter = express.Router();

subjectRouter.post("/create-subject", verifyToken, createSubject);

subjectRouter.get("/get-subjects", verifyToken, getAllSubjects);

subjectRouter.get("/get-subject/:id", verifyToken, getSubjectById);

subjectRouter.put("/update-subject/:id", verifyToken, updateSubject);

subjectRouter.delete("/delete-subject/:id", verifyToken, deleteSubject);

subjectRouter.get("/teacher-subjects", verifyToken, getTeacherSubjects);

subjectRouter.get("/student-subjects", verifyToken,  getStudentSubjects);

export default subjectRouter;