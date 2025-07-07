const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    label: {
        type: String,
        maxLength: 50,
        enum: ["Home", "Work", "Other"],
        default: "Home"
    },
    addressLine1: {
        type: String,
        maxLength: 200,
        required: true
    },
    addressLine2: {
        type: String,
        maxLength: 200
    },
    city: {
        type: String,
        maxLength: 100,
        required: true
    },
    state: {
        type: String,
        maxLength: 100,
        required: true
    },
    postalCode: {
        type: String,
        maxLength: 20,
        required: true
    },
    country: {
        type: String,
        maxLength: 100,
        required: true
    },
    phone: {
        type: String,
        maxLength: 20
    },
    isDefault: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

addressSchema.index({ user: 1, isDefault: 1 }, { unique: true, partialFilterExpression: { isDefault: true } });

const Address = mongoose.model("Address", addressSchema);

module.exports = Address;