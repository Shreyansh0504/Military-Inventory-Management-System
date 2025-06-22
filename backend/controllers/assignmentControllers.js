import AssetModel from "../models/AssetModel.js";
import AssignmentsModel from "../models/AssignmentsModel.js";
import BaseModel from "../models/BaseModel.js";

export const assignAsset = async (req, res) => {
  try {
    const { name, quantity, assigned_to } = req.body;

    if (!name || !quantity || !assigned_to) {
      return res.status(400).send({
        success: false,
        message: "Provide asset name, quantity, and assignee",
      });
    }
    if (req.user.role.toLowerCase() !== "logistics officer") {
      return res.status(403).send({
        success: false,
        message: "Unauthorized access",
      });
    }

    const base = await BaseModel.findById(req.user.base_id).populate(
      "assets.asset"
    );

    if (!base) {
      return res
        .status(404)
        .send({ success: false, message: "Base not found" });
    }

    const asset = await AssetModel.findOne({ name: name.toLowerCase() });

    if (!asset) {
      return res
        .status(404)
        .send({ success: false, message: "Asset not found" });
    }
    const index = base.assets.findIndex(
      (item) => item.asset._id.toString() === asset._id.toString()
    );
    if (index === -1 || base.assets[index].quantity < quantity) {
      return res.status(400).send({
        success: false,
        message: "Insufficient asset quantity in base stock",
      });
    }
    base.assets[index].quantity -= quantity;
    if (!base.assignedAssets) base.assignedAssets = [];

    const assignedIndex = base.assignedAssets.findIndex(
      (item) => item.asset.toString() === asset._id.toString()
    );

    if (assignedIndex !== -1) {
      base.assignedAssets[assignedIndex].quantity += quantity;
    } else {
      base.assignedAssets.push({
        asset: asset._id,
        quantity,
      });
    }

    await base.save();
    const assignment = new AssignmentsModel({
      base_id: base._id,
      asset_id: asset._id,
      assigned_to,
      quantity,
      date: new Date(),
    });

    await assignment.save();

    return res.status(200).send({
      success: true,
      message: "Asset assigned and stock updated",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ success: false, message: "Internal server error" });
  }
};

export const getAssignments = async (req, res) => {
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
    const assignments = await AssignmentsModel.find({ base_id });
    return res.status(200).send({
      success: true,
      message: "Assignments fetched",
      assignments,
    });
  } catch (error) {
    console.log(error);
  }
};
