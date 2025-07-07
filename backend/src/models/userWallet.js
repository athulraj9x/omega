const mongoose = require("mongoose");

// wallet
const userWalletSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    coin: {
      type: Number,
    },
    diamond: {
      type: Number,
    },
    balance: {
      type: Number,
      min: 0,
      max: 200000000000,
    },
    currencyId: {

      type: mongoose.Schema.Types.ObjectId, ref: "Currency"
    }
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } } // Enable timestamps 
);
// wallet

module.exports = mongoose.model("UserWallet", userWalletSchema);
