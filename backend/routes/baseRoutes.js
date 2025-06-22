import express from "express"
import { createBase, getAllBase, getBaseDetails } from "../controllers/baseControllers.js";
import { adminProtect, protect } from "../utils/authMiddlewares.js";

export const baseRouter = express.Router()

// create base
baseRouter.post("/create-base", adminProtect, createBase);
baseRouter.get("/get-all-base", adminProtect, getAllBase);
baseRouter.post("/get-base", protect, getBaseDetails);
