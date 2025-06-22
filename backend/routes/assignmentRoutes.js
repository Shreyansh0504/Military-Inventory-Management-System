import express from "express"
import { assignAsset, getAssignments } from "../controllers/assignmentControllers.js";
import { protect } from "../utils/authMiddlewares.js";

export const assignmentRouter = express.Router()

// assignment asset
assignmentRouter.post("/assign-asset", protect, assignAsset);
assignmentRouter.post("/get-assignments", protect, getAssignments);
