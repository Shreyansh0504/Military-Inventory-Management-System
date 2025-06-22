import express from "express"
import { adminProtect } from "../utils/authMiddlewares.js";
import { creditToBase } from "../controllers/expenseControllers.js";

export const expenseRouter = express.Router();

// credit expense
expenseRouter.post("/credit-expense", adminProtect, creditToBase);
