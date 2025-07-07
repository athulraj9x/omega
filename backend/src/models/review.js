const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});

ReviewSchema.index({ user: 1, product: 1 }, { unique: true }); // one review per user per product

module.exports = mongoose.model('Review', ReviewSchema);
