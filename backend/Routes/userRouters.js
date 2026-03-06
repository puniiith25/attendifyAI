import express from "express";
import { pool } from "../Database/db.js";
import { logoutUser, userLogin, userRegister } from "../Controllers/userControll.js";
import { authorizeRole, verifyToken } from "../Midddlewares/verifyToken.js";

const userRouter = express.Router();

userRouter.post('/register', verifyToken, authorizeRole("admin"), userRegister);
userRouter.post('/login', userLogin);
userRouter.post('/logout', logoutUser);

export default userRouter;