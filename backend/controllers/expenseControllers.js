import BaseModel from "../models/BaseModel.js";
import ExpendituresModel from "../models/ExpendituresModel.js";

export const creditToBase = async (req, res) => {
  try {
    const { base_name, amount } = req.body;

    if (req.user.role.toLowerCase() !== "admin") {
      return res
        .status(403)
        .send({ success: false, message: "Only admin can credit funds" });
    }

    if (!base_name || !amount) {
      return res
        .status(400)
        .send({ success: false, message: "Base name and amount required" });
    }

    const base = await BaseModel.findOne({ name: base_name.toLowerCase() });

    let account = await ExpendituresModel.findOne({ base_id: base._id });

    if (account) {
      account.amount_in_account += amount;
      account.date = new Date();
    } else {
      account = new ExpendituresModel({
        base_id: base._id,
        amount_in_account: amount,
        date: new Date(),
      });
    }

    await account.save();

    base.amount_in_account += amount;
    await base.save()

    return res.status(200).send({
      success: true,
      message: `₹${amount} credited to base`,
      updated_balance: account.amount_in_account,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
};
