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

// AUTH ROUTES

userRouter.post("/login", userLogin);
userRouter.post("/logout", verifyToken, logoutUser);


// USER MANAGEMENT (ADMIN)

userRouter.post("/users", verifyToken, userRegister);   // create user
userRouter.get("/users", verifyToken, getAllUsers);     // list users
userRouter.get("/users/:id", verifyToken, getUserById); // single user
userRouter.put("/users/:id", verifyToken, updateUser);  // update user
userRouter.delete("/users/:id", verifyToken, deleteUser); // delete user


export default userRouter;