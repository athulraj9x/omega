const mongoose = require("mongoose");

const userTransactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    currencyType: { type: String, enum: ["coin", "diamond"], required: true },
    action: { type: String, enum: ["TRANSFER", "RECEIVED", "EARNED", "SPENT"], required: true },
    referenceId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // from/to
    description: { type: String },
    gameRoom: { type: String },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserTransaction", userTransactionSchema);
