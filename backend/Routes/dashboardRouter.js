import express from "express";


import { verifyToken } from "../Midddlewares/verifyToken.js";
import { getAdminDashboard, getTeacherDashboard } from "../Controllers/dashboard.js";

const dashboardRouter = express.Router();


dashboardRouter.get("/data", verifyToken, getAdminDashboard);
dashboardRouter.get("/teacher/data", verifyToken, getTeacherDashboard);


export default dashboardRouter;