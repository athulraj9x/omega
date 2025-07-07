const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    updatedAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});

WishlistSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Wishlist', WishlistSchema);
