import express from "express"
import { protect } from "../utils/authMiddlewares.js";
import { getPurchase, purchaseAsset } from "../controllers/purchaseControllers.js";

export const purchaseRouter = express.Router();

// create purchase
purchaseRouter.post("/create-purchase", protect, purchaseAsset);
purchaseRouter.post("/get-purchase", protect, getPurchase);
