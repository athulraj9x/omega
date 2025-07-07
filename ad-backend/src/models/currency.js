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

    createDate: "date",
    updatedDate: "date",
  },
  { timestamps: { createDate: "createdAt", updatedDate: "updated_at" } }
);

module.exports = mongoose.model("Currency", currencySchema);
