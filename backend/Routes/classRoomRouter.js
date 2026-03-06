import express from "express";
import { verifyToken } from "../Midddlewares/verifyToken.js";
import { createClassroom, deleteClassroom, getAllClassrooms, updateClassroom } from "../Controllers/classRoomController.js";



const ClassRoomRouter = express.Router();

ClassRoomRouter.post("/createClassroom", verifyToken, createClassroom);

ClassRoomRouter.get("/getAllClassrooms", verifyToken, getAllClassrooms);

ClassRoomRouter.put("/updateClassroom/:id", verifyToken, updateClassroom);

ClassRoomRouter.delete("/deleteClassroom/:id", verifyToken, deleteClassroom);

export default ClassRoomRouter;