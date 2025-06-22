import AssetModel from "../models/AssetModel.js";
import BaseModel from "../models/BaseModel.js";
import PurchasesModel from "../models/PurchasesModel.js";
import ExpendituresModel from "../models/ExpendituresModel.js";

export const purchaseAsset = async (req, res) => {
  try {
    const { name, quantity } = req.body;

    if (req.user.role.toLowerCase() !== "logistics officer") {
      return res.status(403).send({ success: false, message: "Unauthorized" });
    }

    if (!name || !quantity) {
      return res
        .status(400)
        .send({ success: false, message: "Provide all details" });
    }

    const base = await BaseModel.findById(req.user.base_id).populate(
      "assets.asset"
    );
    const asset = await AssetModel.findOne({ name: name.toLowerCase() });
    if (!asset)
      return res
        .status(404)
        .send({ success: false, message: "Asset not found" });

    const cost = quantity * asset.price;

    if (base.amount_in_account < cost) {
      return res
        .status(400)
        .send({ success: false, message: "Insufficient funds" });
    }

    // Add to assets stock
    const index = base.assets.findIndex(
      (item) => item.asset._id.toString() === asset._id.toString()
    );
    if (index !== -1) {
      base.assets[index].quantity += quantity;
    } else {
      base.assets.push({ asset: asset._id, quantity });
    }

    // Financial deduction
    const expenditure = await ExpendituresModel.findOne({ base_id: base._id });
    base.amount_in_account -= cost;
    expenditure.amount_in_account -= cost;
    expenditure.date = new Date();

    await base.save();
    await expenditure.save();

    // Log purchase
    const purchase = new PurchasesModel({
      base_id: base._id,
      asset_id: asset._id,
      quantity,
      cost,
      date: new Date(),
    });
    await purchase.save();

    return res.status(200).send({
      success: true,
      message: "Asset purchased and balance updated",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Server error" });
  }
};

export const getPurchase = async (req, res) => {
  try {
    const { base_id } = req.body;
    const base = await BaseModel.findById(base_id);
    if (!base) {
      return res.status(400).send({
        success: false,
        message: "Base not found",
      });
    }
    if (req.user.base_id.toString() !== base._id.toString()) {
      return res.status(400).send({
        success: false,
        message: "Not authorized to access",
      });
    }
    const purchase = await PurchasesModel.find({ base_id: base._id });
    return res.status(200).send({
      success: true,
      message: "Puchases fetched",
      purchase,
    });
  } catch (error) {
    console.log(error);
  }
};
