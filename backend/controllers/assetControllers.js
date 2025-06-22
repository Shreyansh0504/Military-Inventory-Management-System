import AssetModel from "../models/AssetModel.js";


export const createAsset = async (req, res) => {
  try {
    const { name, type, price } = req.body;
    if (!name || !type) {
      res.status(400).send({
        success: false,
        message: "Provide all details",
      });
    }
    const asset_name = name.toLowerCase()
    const existingAsset = await AssetModel.findOne({ name: asset_name });

    if (existingAsset) {
      res.status(400).send({
        success: false,
        message: "Asset already existing",
      });
    }

    const asset = new AssetModel({
      name: asset_name,
      type: type.toLowerCase(),
      price,
    });
    await asset.save();

    res.status(200).send({
      success: true,
      message: "Asset Created",
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllAssets = async(req, res)=>{
  try {
    const assets = await AssetModel.find()
    if (assets.length == 0) {
      return res.status(400).send({
        success: false,
        message: "No Asset Found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Assets Fetched",
      assets,
    });
  } catch (error) {
    console.log(error)
  }
}