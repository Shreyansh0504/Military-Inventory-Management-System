import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import BaseModel from "../models/BaseModel.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, role, base_name } = req.body;
    if (!name || !email || !password || !role || !base_name) {
      return res.status(400).send({
        success: false,
        message: "Provide all details",
      });
    }

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: "Existing User",
      });
    }
    const base_name_insmall = base_name.toLowerCase();
    const existingBase = await BaseModel.findOne({ name: base_name_insmall });

    if (!existingBase) {
      return res.status(400).send({
        success: false,
        message: "No Base Found",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserModel({
      name,
      email,
      password: hashedPassword,
      role,
      base_id: existingBase,
    });
    await user.save();

    return res.status(200).send({
      success: true,
      message: "User Registered",
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Provide all details",
      });
    }

    const existingUser = await UserModel.findOne({ email });

    if (!existingUser) {
      return res.status(400).send({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (isMatch) {
      const token = jwt.sign({ id: existingUser._id }, process.env.SECRET_KEY, {
        expiresIn: "7d",
      });
      return res.status(200).send({
        success: true,
        message: "User Logged In",
        user: { ...existingUser, password: null },
        token,
      });
    } else {
      return res.status(400).send({
        success: false,
        message: "Invalid Credentials",
      });
    }
  } catch (error) {
    console.log(error);
  }
};


export const getUser = async(req, res)=>{
  try {
    return res.status(200).send({
      success: true,
      user: req.user
    })
  } catch (error) {
    console.log(error)
  }
}

export const getAllUser = async(req, res)=>{
  try {
   const users = await UserModel.find().select("-password");
    if(users.length==0){
      return res.status(400).send({
        success: false,
        message: "No User Found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Users Fetched",
      users
    })
  } catch (error) {
    console.log(error)
  }
}