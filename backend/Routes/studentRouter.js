import express from "express";
import { authorizeRole, verifyToken } from "../Midddlewares/verifyToken.js";

import {
    createStudent,
    getStudents,
    getStudentById,
    getLoggedStudent,
    updateStudent,
    deleteStudent
} from "../Controllers/studentController.js";

const studentRouter = express.Router();

studentRouter.post("/create-student", verifyToken, authorizeRole("admin"), createStudent);

studentRouter.get("/get-students", verifyToken, authorizeRole("admin"), getStudents);

studentRouter.get("/get-student/:id", verifyToken, authorizeRole("admin"), getStudentById);

studentRouter.get("/my-student", verifyToken, authorizeRole("student"), getLoggedStudent);

studentRouter.put("/update-student/:id", verifyToken, authorizeRole("admin"), updateStudent);

studentRouter.delete("/delete-student/:id", verifyToken, authorizeRole("admin"), deleteStudent);

export default studentRouter;