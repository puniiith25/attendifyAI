import express from "express";
import {
    logoutUser,
    userLogin,
    userRegister,
    updateUser,
    deleteUser,
    getAllUsers,
    getUserById
} from "../Controllers/userControll.js";

import { verifyToken } from "../Midddlewares/verifyToken.js";

const userRouter = express.Router();

// AUTH

userRouter.post("/login", userLogin);
userRouter.post("/logout", verifyToken, logoutUser);

// USER MANAGEMENT

userRouter.post("/create-user", verifyToken, userRegister);
userRouter.get("/get-users", verifyToken, getAllUsers);
userRouter.get("/get-user/:id", verifyToken, getUserById);
userRouter.put("/update-user/:id", verifyToken, updateUser);
userRouter.delete("/delete-user/:id", verifyToken, deleteUser);

export default userRouter;