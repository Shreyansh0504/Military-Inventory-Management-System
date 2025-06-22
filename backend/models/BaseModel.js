import mongoose from "mongoose";

const baseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    amount_in_account: {
      type: Number,
      required: true,
      default: 0,
    },
    assets: [
      {
        asset: { type: mongoose.Schema.Types.ObjectId, ref: "Asset" },
        quantity: { type: Number, default: 0 },
      },
    ],
    assignedAssets: [
      {
        asset: { type: mongoose.Schema.Types.ObjectId, ref: "Asset" },
        quantity: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Base", baseSchema);
