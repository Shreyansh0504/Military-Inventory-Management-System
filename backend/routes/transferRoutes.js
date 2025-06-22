import express from "express"
import { protect } from "../utils/authMiddlewares.js";
import {
  transferAsset,
  getTransfer,
} from "../controllers/transferControllers.js";

export const transferRouter = express.Router();

// do transfer
transferRouter.post("/create-transfer", protect, transferAsset);
transferRouter.post("/get-transfer", protect, getTransfer);
