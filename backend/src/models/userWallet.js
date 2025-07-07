const mongoose = require("mongoose");

// wallet
const userWalletSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    winningValue: {
      type: Number,
      default: 0
    },
    entryValue: {
      type: Number,
      default: 0
    },
    coin: {
      type: Number,
    },
    diamond: {
      type: Number,
    }
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } } // Enable timestamps 
);
// wallet

module.exports = mongoose.model("UserWallet", userWalletSchema);
