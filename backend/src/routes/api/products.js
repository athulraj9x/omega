const ProductController = require('../../controllers/app/product/productController');

const router = require('express').Router();

// @route   GET /api/products
router.get('/', ProductController.listProduct);

// @route   GET /api/products/search
router.get('/search', ProductController.searchProduct);

// @route   GET /api/products/filters
router.get('/filters', ProductController.getFilters);

// @route   GET /api/products/featured
router.get('/featured', ProductController.getFeatured);


// @route   GET /api/products/:id/similar
router.get('/:id/similar', ProductController.getSimilarProducts);

// @route   GET /api/products/:id/related
router.get('/:id/related', ProductController.getRelatedProducts);

// @route   GET /api/products/:id/related
router.get('/:id/reviews', ProductController.getProductReviews);
// @route   GET /api/products/:id/ratings
router.get('/:id/ratings', ProductController.getProductRatings);
router.get('/:slug', ProductController.getProductBySlug);



// @route   GET /api/products/bestsellers
router.get('/bestsellers', ProductController.getBestsellers);

// @route   GET /api/products/new-arrivals
router.get('/new-arrivals', ProductController.getNewArrivals);

// @route   GET /api/products/deals
router.get('/deals', ProductController.getDeals);

// @route   GET /api/products/trending
router.get('/trending', ProductController.getTrending);

// @route   GET /api/products/categories
router.get('/categories', ProductController.getCategories);

// @route   GET /api/products/brands
router.get('/brands', ProductController.getBrands);

// @route   GET /api/products/bundles
router.get('/bundles', ProductController.getBundles);

// @route   GET /api/products/wishlist
router.get('/wishlist', ProductController.getWishlist);

// @route   GET /api/products/recently-viewed
router.get('/recently-viewed', ProductController.getRecentlyViewed);

// @route   GET /api/products/:id/variants
router.get('/:id/variants', ProductController.getVariants);

// @route   GET /api/products/:id/reviews

// @route   GET /api/products/:id/availability
router.get('/:id/availability', ProductController.checkAvailability);

// @route   GET /api/products/:id/delivery-options
router.get('/:id/delivery-options', ProductController.getDeliveryOptions);

// @route   GET /api/products/:id/compare
router.get('/:id/compare', ProductController.getCompareData);

// @route   GET /api/products/:slug

module.exports = router;
