import BaseModel from "../models/BaseModel.js";

export const createBase = async (req, res) => {
  try {
    const { name, location } = req.body;
    if (!name || !location) {
      res.status(400).send({
        success: false,
        message: "Provide all details",
      });
    }
    const base_name = name.toLowerCase();
    const existingBase = await BaseModel.findOne({ name: base_name });

    if (existingBase) {
      res.status(400).send({
        success: false,
        message: "Base already existing",
      });
    }

    const base = new BaseModel({
      name: base_name,
      location,
    });
    await base.save();

    res.status(200).send({
      success: true,
      message: "Base Created",
    });
  } catch (error) {
    console.log(error);
  }
};

export const getBaseDetails = async (req, res) => {
  try {
    const { base_id } = req.body;
    console.log(base_id)
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
    return res.status(200).send({
      success: true,
      message: "Base fetched",
      base,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllBase = async(req, res)=>{
  try {
    const bases = await BaseModel.find()
    if(bases.length==0){
      return res.status(400).send({
        success: false,
        message: "No Base Found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Bases Fetched",
      bases
    })
  } catch (error) {
    console.log(error)
  }
}