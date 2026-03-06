import express from "express";
import { authorizeRole, verifyToken } from "../Midddlewares/verifyToken.js";
import { createSection, getSections, getSingle_Section } from "../Controllers/sectionController.js";

const secRouter = express.Router();

secRouter.post('/createSec', verifyToken, authorizeRole("admin"), createSection);
secRouter.get('/get-sections', getSections);
secRouter.get('/section/:sec_name', getSingle_Section);

export default secRouter;