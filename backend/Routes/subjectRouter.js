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

subjectRouter.post("/create-subject", verifyToken, authorizeRole("admin"), createSubject);

subjectRouter.get("/get-subjects", verifyToken, authorizeRole("admin"), getAllSubjects);

subjectRouter.get("/get-subject/:id", verifyToken, authorizeRole("admin"), getSubjectById);

subjectRouter.put("/update-subject/:id", verifyToken, authorizeRole("admin"), updateSubject);

subjectRouter.delete("/delete-subject/:id", verifyToken, authorizeRole("admin"), deleteSubject);

subjectRouter.get("/teacher-subjects", verifyToken, authorizeRole("teacher"), getTeacherSubjects);

subjectRouter.get("/student-subjects", verifyToken, authorizeRole("student"), getStudentSubjects);

export default subjectRouter;