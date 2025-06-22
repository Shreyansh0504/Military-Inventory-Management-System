import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    base_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Base",
    },
    asset_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Asset",
    },
    assigned_to: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Assignments", assignmentSchema);
