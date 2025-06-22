import BaseModel from "../models/BaseModel.js";
import AssetModel from "../models/AssetModel.js";
import TransferModel from "../models/TransfersModel.js";
import ExpendituresModel from "../models/ExpendituresModel.js";

export const transferAsset = async (req, res) => {
  try {
    const { to_base_id, asset_name, quantity } = req.body;

    if (req.user.role.toLowerCase() !== "logistics officer") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const from_base_id = req.user.base_id;
    const asset = await AssetModel.findOne({ name: asset_name.toLowerCase() });
    if (!asset)
      return res
        .status(404)
        .json({ success: false, message: "Asset not found" });

    const fromBase = await BaseModel.findById(from_base_id).populate(
      "assets.asset"
    );
    const toBase = await BaseModel.findById(to_base_id).populate(
      "assets.asset"
    );

    const assetPrice = asset.price;
    const totalCost = quantity * assetPrice;

    // Check if source base has sufficient stock
    const fromIndex = fromBase.assets.findIndex(
      (item) => item.asset._id.toString() === asset._id.toString()
    );
    if (fromIndex === -1 || fromBase.assets[fromIndex].quantity < quantity) {
      return res
        .status(400)
        .json({ success: false, message: "Insufficient stock at source base" });
    }

    // Update asset quantities
    fromBase.assets[fromIndex].quantity -= quantity;
    const toIndex = toBase.assets.findIndex(
      (item) => item.asset._id.toString() === asset._id.toString()
    );
    if (toIndex !== -1) {
      toBase.assets[toIndex].quantity += quantity;
    } else {
      toBase.assets.push({ asset: asset._id, quantity });
    }

    // Financial logic
    const fromExpenditure = await ExpendituresModel.findOne({
      base_id: from_base_id,
    });
    const toExpenditure = await ExpendituresModel.findOne({
      base_id: to_base_id,
    });

    fromBase.amount_in_account += totalCost;
    toBase.amount_in_account -= totalCost;
    fromExpenditure.amount_in_account += totalCost;
    toExpenditure.amount_in_account -= totalCost;

    fromExpenditure.date = toExpenditure.date = new Date();
    await fromBase.save();
    await toBase.save();
    await fromExpenditure.save();
    await toExpenditure.save();

    // Log transfer
    const transfer = new TransferModel({
      from_base_id,
      to_base_id,
      asset_id: asset._id,
      quantity,
      date: new Date(),
    });
    await transfer.save();

    return res.status(200).json({
      success: true,
      message: "Asset transferred and finances updated",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getTransfer = async (req, res) => {
  try {
    const { base_id } = req.body;
    const base = await BaseModel.find({ _id: base_id });
    if (!base) {
      return res.status(400).send({
        success: false,
        message: "Base not found",
      });
    }
    if (req.user.base_id.toString() !== base_id) {
      return res.status(400).send({
        success: false,
        message: "Not authorized to access",
      });
    }
    const transfers = await TransferModel.find({
      $or: [{ from_base_id: base_id }, { to_base_id: base_id }],
    });
    return res.status(200).send({
      success: true,
      message: "Transfers fetched",
      transfers,
    });
  } catch (error) {
    console.log(error);
  }
};
