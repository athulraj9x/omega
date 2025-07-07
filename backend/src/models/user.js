const mongoose = require("mongoose");

// Login history
const loginHistorySchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Types.ObjectId, ref: "User" },
    login_details: [{ type: Object }],
    createDate: "date",
    updatedDate: "date",
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } } // Enable timestamps 
);
// Login history

// User
const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      maxLength: 100,
    },
    last_name: {
      type: String,
      maxLength: 100,
    },
    username: {
      type: String,
      required: true,
      maxLength: 100,
    },
    email: {
      type: String,
      maxLength: 100,
    },
    password: {
      type: String,
      maxLength: 100,
    },
    google_pic: {
      type: String,
      default: '',
    },
    profile_pic: {
      type: String,
      default: '',
    },
    password_text: {
      type: String,
      maxLength: 100,
    },
    google_id: {
      type: String,
      maxLength: 100,
    },
    mobile_no: {
      type: Number,
      maxLength: 15,
    },
    exit_attempt_count: {
      type: Number,
      maxLength: 4,
      default: 0
    },
    device_code: {
      type: String,
      maxLength: 100,
    },
    guest_login: {
      type: String,
      maxLength: 100,
    },
    email_verify: {
      type: "date",
      default: null,
      Comment: { date: "verified", null: "not verified" },
    },
    token: {
      type: String,
    },
    is_guest: {
      type: Boolean,
      default: false,
    },
    currency_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Currency",
    },
    wallet_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserWallet",
    },
    balance: {
      type: Number,
      required: false,
      min: 0,
      max: 200000000000,
    },
    ip_address: {
      system_ip: {
        type: String,
        default: null,
      },
      browser_ip: {
        type: String,
        default: null,
      },
    },
    last_login: {
      type: Date,
    },
    status: {
      type: String,
      default: "0",
      enum: ["0", "1", "2", "3"], //0-inactive, 1- active, 2- deleted
    },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } } // Enable timestamps 
);
// User

const UserLoginHistory = mongoose.model("UserLoginHistory", loginHistorySchema);
const User = mongoose.model("User", userSchema);

module.exports = {
  User,
  UserLoginHistory
};
