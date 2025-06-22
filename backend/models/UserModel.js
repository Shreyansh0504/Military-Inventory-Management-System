import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    base_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Base",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
