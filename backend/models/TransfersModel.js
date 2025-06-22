import mongoose from "mongoose";

const transferSchema = new mongoose.Schema(
  {
    from_base_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Base",
    },
    to_base_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Base",
    },
    asset_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Asset",
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

export default mongoose.model("Transfers", transferSchema);
