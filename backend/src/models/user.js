const mongoose = require("mongoose");
const { ROLES } = require("../services/Constants");

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
    email: {
      type: String,
      maxLength: 100,
    },
    password: {
      type: String,
      maxLength: 100,
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
    currency_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Currency",
    },
    addresses_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    wallet_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserWallet",
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
    role: {
      type: String,
      enum: Object.values(ROLES).map(r => r.name),
      default: ROLES.USER.name,
    },
    roleLevel: {
      type: Number,
      default: ROLES.USER.level,
    },

  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  } // Enable timestamps 
);
// User

userSchema.virtual('addresses', {
  ref: 'Address',
  localField: '_id',
  foreignField: 'user'
});

userSchema.methods.getAddresses = async function () {
  await this.populate('addresses');
  return this.addresses;
};

const UserLoginHistory = mongoose.model("UserLoginHistory", loginHistorySchema);
const User = mongoose.model("User", userSchema);

module.exports = {
  User,
  UserLoginHistory
};
