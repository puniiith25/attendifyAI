import express from "express";


import { verifyToken } from "../Midddlewares/verifyToken.js";
import { getAdminDashboard } from "../Controllers/dashboard.js";

const dashboardRouter = express.Router();


dashboardRouter.get("/data", verifyToken, getAdminDashboard);


export default dashboardRouter;