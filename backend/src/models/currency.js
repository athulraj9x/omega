const mongoose = require("mongoose");

const currencySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      maxLength: 100,
    },
    code: {
      type: String,
      maxLength: 100,
    },
    value: {
      type: String,
      maxLength: 100,
    },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } } // Enable timestamps 
);

module.exports = mongoose.model("Currency", currencySchema);
