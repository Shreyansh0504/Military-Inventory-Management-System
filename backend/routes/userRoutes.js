import express from "express";
import { getAllUser, getUser, login, register } from "../controllers/userControllers.js";
import { adminProtect, protect } from "../utils/authMiddlewares.js";

export const userRouter = express.Router();

// register
userRouter.post("/register", register);

// login
userRouter.post("/login", login);
userRouter.get("/getUser", protect, getUser);
userRouter.get("/get-all-users", adminProtect, getAllUser);
