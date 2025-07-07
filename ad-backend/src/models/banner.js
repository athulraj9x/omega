const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      maxLength: 100,
    },
    device: {
      type: String,
      maxLength: 20,
      enum: ["desktop", "mobile"],
    },
    status: {
      type: String,
      default: "1",
    },
    whiteLabelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WhiteLabel",
    },
    createDate: "date",
    updatedDate: "date",
  },
  { timestamps: { createDate: "createdAt", updatedDate: "updated_at" } }
);

module.exports = mongoose.model("Banner", bannerSchema);
