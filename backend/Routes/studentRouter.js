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

studentRouter.post("/create-student", verifyToken,  createStudent);

studentRouter.get("/get-students", verifyToken,  getStudents);

studentRouter.get("/get-student/:id", verifyToken,  getStudentById);

studentRouter.get("/my-student", verifyToken,  getLoggedStudent);

studentRouter.put("/update-student/:id", verifyToken,  updateStudent);

studentRouter.delete("/delete-student/:id", verifyToken,  deleteStudent);

export default studentRouter;