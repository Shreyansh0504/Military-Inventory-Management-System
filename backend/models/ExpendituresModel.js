import mongoose from "mongoose";

const expendituresSchema = new mongoose.Schema(
  {
    base_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Base",
    },
    amount_in_account: {
      type: Number,
      required: true,
      default: 0, 
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Expenditures", expendituresSchema);
