import mongoose from "mongoose";

const purchasesSchema = new mongoose.Schema(
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
    quantity: {
      type: Number,
      required: true,
    }, 
    cost: {
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

export default mongoose.model("Purchases", purchasesSchema);
