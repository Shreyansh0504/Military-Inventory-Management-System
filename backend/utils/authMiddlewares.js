import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel.js";

export const protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = await UserModel.findById(decoded.id).select("-password");
        next();
      } catch (error) {
        console.log(error);
        res.status(401).json({ message: "Not authorized, token failed" });
      }
    } else {
      res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const adminProtect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = await UserModel.findById(decoded.id).select("-password");
        if (req.user && req.user.role === "admin") {
          next();
        } else {
          res.status(401).json({ message: "Not authorized as an admin" });
        }
      } catch (error) {
        console.log(error);
        res.status(401).json({ message: "Not authorized, token failed" });
      }
    }
    if (!token) {
      res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
