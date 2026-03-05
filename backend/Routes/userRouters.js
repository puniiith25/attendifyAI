import express from "express";
import { pool } from "../Database/db.js";
import { logoutUser, userLogin, userRegister } from "../Controllers/userControll.js";

const router = express.Router();

router.post('/register',userRegister);
router.post('/login',userLogin);
router.post('/logout',logoutUser);

export default router;