import express from "express"
import { createAsset, getAllAssets } from "../controllers/assetControllers.js";
import { adminProtect } from "../utils/authMiddlewares.js";

export const assetRouter = express.Router();

// create asset
assetRouter.post("/create-asset", adminProtect, createAsset);
assetRouter.get("/get-all-asset", adminProtect, getAllAssets);
