const router = require("express").Router();

const authentication = require('./authentication');
const product = require('./products');
const userCart = require('./cart');
const userWishlist = require('./wishlist');
const userOrders = require('./orders');

router.use('/v1/auth', authentication)
router.use('/v1/products', product)
router.use('/v1/cart', userCart)
router.use('/v1/wishlist', userWishlist)
router.use('/v1/orders', userOrders)


module.exports = router