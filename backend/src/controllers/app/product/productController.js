const mongoose = require("mongoose");
const {
    successResponseData,
    errorResponseData,
    validationErrorResponseData
} = require("../../../services/Response");
const { Product } = require("../../../models");

// Example: GET /api/products
module.exports = {
    listProduct: async (req, res) => {
        try {
            const {
                category,
                minPrice,
                maxPrice,
                sort,
                search,
                page = 1,
                limit = 20,
                brands,
                colors,
                sizes
            } = req.query;

            const query = { status: "active" };

            if (category) query.category = category;
            if (minPrice || maxPrice) {
                query.price = {};
                if (minPrice) query.price.$gte = parseFloat(minPrice);
                if (maxPrice) query.price.$lte = parseFloat(maxPrice);
            }
            if (search) {
                query.name = { $regex: search, $options: "i" };
            }

            const skip = (page - 1) * limit;

            const sortQuery = sort
                ? sort === "price_asc"
                    ? { price: 1 }
                    : sort === "price_desc"
                        ? { price: -1 }
                        : sort === "newest"
                            ? { createdAt: -1 }
                            : {}
                : {};

            const products = await Product.find(query)
                .sort(sortQuery)
                .skip(skip)
                .limit(parseInt(limit));

            const total = await Product.countDocuments(query);

            return successResponseData(res, products, 200, "Products fetched", {
                total,
                page: parseInt(page),
                limit: parseInt(limit)
            });
        } catch (err) {
            console.error("List Products Error:", err);
            return errorResponseData(res, "Failed to fetch products");
        }
    },

    searchProduct: async (req, res) => {
        const { q, limit = 10 } = req.query;
        try {
            if (!q) return validationErrorResponseData(res, "Search query is required");

            const products = await Product.find({
                $text: { $search: q }
            }).limit(parseInt(limit));

            return successResponseData(res, products, 200, "Search results");
        } catch (err) {
            return errorResponseData(res, "Failed to search products");
        }
    },

    // Example: GET /api/products/:slug
    getProductBySlug: async (req, res) => {
        try {
            const product = await Product.findOne({ slug: req.params.slug });
            if (!product) return errorResponseData(res, "Product not found", 404);
            return successResponseData(res, product, 200, "Product found");
        } catch (err) {
            return errorResponseData(res, "Error fetching product");
        }
    },

    // Example: GET /api/products/:id/similar
    getSimilarProducts: async (req, res) => {
        try {
            const { id } = req.params;
            const { limit = 4 } = req.query;

            const current = await Product.findById(id);
            if (!current) return errorResponseData(res, "Product not found");

            const similar = await Product.find({
                category: current.category,
                _id: { $ne: id }
            }).limit(parseInt(limit));

            return successResponseData(res, similar, 200, "Similar products");
        } catch (err) {
            return errorResponseData(res, "Failed to fetch similar products");
        }
    },

    // Example: GET /api/products/:id/related
    getRelatedProducts: async (req, res) => {
        try {
            // For simplicity, return 4 random products
            const related = await Product.aggregate([{ $sample: { size: 4 } }]);
            return successResponseData(res, related, 200, "Related products");
        } catch (err) {
            return errorResponseData(res, "Error getting related products");
        }
    },

    // Example: GET /api/products/filters
    getFilters: async (req, res) => {
        try {
            const categories = await Product.distinct("category");
            const brands = await Product.distinct("brand");
            const colors = await Product.distinct("colors");
            const sizes = await Product.distinct("sizes");

            const prices = await Product.aggregate([
                {
                    $group: {
                        _id: null,
                        min: { $min: "$price" },
                        max: { $max: "$price" }
                    }
                }
            ]);

            return successResponseData(res, {
                categories,
                brands,
                colors,
                sizes,
                priceRange: prices[0] || { min: 0, max: 0 }
            }, 200, "Available filters");
        } catch (err) {
            return errorResponseData(res, "Error getting filters");
        }
    },

    // Example: GET /api/products/featured
    getFeatured: async (req, res) => {
        try {
            const { limit = 8 } = req.query;
            const products = await Product.find({ isFeatured: true }).limit(parseInt(limit));
            return successResponseData(res, products, 200, "Featured products");
        } catch (err) {
            return errorResponseData(res, "Failed to fetch featured products");
        }
    },

    // Example: GET /api/products/:id/reviews
    getProductReviews: async (req, res) => {
        try {
            const { id } = req.params;
            const { sort = "newest", page = 1, limit = 10 } = req.query;

            const sortOptions = {
                newest: { createdAt: -1 },
                highest: { rating: -1 },
                lowest: { rating: 1 }
            };

            const skip = (page - 1) * limit;

            const reviews = await Review.find({ product: id })
                .sort(sortOptions[sort] || sortOptions.newest)
                .skip(skip)
                .limit(parseInt(limit));

            return successResponseData(res, reviews, 200, "Product reviews");
        } catch (err) {
            return errorResponseData(res, "Failed to get reviews");
        }
    },

    // Example: GET /api/products/:id/ratings
    getProductRatings: async (req, res) => {
        try {
            const { id } = req.params;

            const result = await Review.aggregate([
                { $match: { product: new mongoose.Types.ObjectId(id) } },
                {
                    $group: {
                        _id: "$rating",
                        count: { $sum: 1 }
                    }
                }
            ]);

            let total = 0;
            let sum = 0;
            const breakdown = {};

            result.forEach(({ _id, count }) => {
                breakdown[_id] = count;
                total += count;
                sum += _id * count;
            });

            const average = total ? (sum / total).toFixed(1) : 0;

            return successResponseData(res, {
                average: parseFloat(average),
                count: total,
                breakdown
            }, 200, "Rating summary");
        } catch (err) {
            return errorResponseData(res, "Failed to fetch ratings");
        }
    },
    // Bestselling products (mocked by ratingsCount)
    getBestsellers: async (req, res) => {
        try {
            const { limit = 8 } = req.query;
            const products = await Product.find({ status: "active" })
                .sort({ ratingsCount: -1 })
                .limit(parseInt(limit));
            return successResponseData(res, products, 200, "Bestselling products");
        } catch (err) {
            return errorResponseData(res, "Failed to fetch bestsellers");
        }
    },

    // New Arrivals
    getNewArrivals: async (req, res) => {
        try {
            const { limit = 8 } = req.query;
            const products = await Product.find({ status: "active" })
                .sort({ createdAt: -1 })
                .limit(parseInt(limit));
            return successResponseData(res, products, 200, "New arrivals");
        } catch (err) {
            return errorResponseData(res, "Failed to fetch new arrivals");
        }
    },

    // Deals (products with discountPrice < price)
    getDeals: async (req, res) => {
        try {
            const { limit = 8 } = req.query;
            const products = await Product.find({
                status: "active",
                discountPrice: { $lt: "$price" }
            }).limit(parseInt(limit));
            return successResponseData(res, products, 200, "Deals");
        } catch (err) {
            return errorResponseData(res, "Failed to fetch deals");
        }
    },

    // Trending (mock by ratingsAverage)
    getTrending: async (req, res) => {
        try {
            const { limit = 8 } = req.query;
            const products = await Product.find({ status: "active" })
                .sort({ ratingsAverage: -1 })
                .limit(parseInt(limit));
            return successResponseData(res, products, 200, "Trending products");
        } catch (err) {
            return errorResponseData(res, "Failed to fetch trending");
        }
    },

    // Get categories
    getCategories: async (req, res) => {
        try {
            const categories = await Product.distinct("category");
            return successResponseData(res, categories, 200, "Categories fetched");
        } catch (err) {
            return errorResponseData(res, "Failed to fetch categories");
        }
    },

    // Get brands
    getBrands: async (req, res) => {
        try {
            const brands = await Product.distinct("brand");
            return successResponseData(res, brands, 200, "Brands fetched");
        } catch (err) {
            return errorResponseData(res, "Failed to fetch brands");
        }
    },

    // Get bundles (mock by isBundle flag)
    getBundles: async (req, res) => {
        try {
            const bundles = await Product.find({ isBundle: true });
            return successResponseData(res, bundles, 200, "Bundles fetched");
        } catch (err) {
            return errorResponseData(res, "Failed to fetch bundles");
        }
    },

    // Wishlist products (requires auth middleware)
    getWishlist: async (req, res) => {
        try {
            const wishlist = await Wishlist.findOne({ user: req.user._id }).populate("products");
            return successResponseData(res, wishlist?.products || [], 200, "Wishlist");
        } catch (err) {
            return errorResponseData(res, "Failed to fetch wishlist");
        }
    },

    // Recently viewed products (requires auth middleware)
    getRecentlyViewed: async (req, res) => {
        try {
            const { limit = 12 } = req.query;
            const user = await User.findById(req.user._id).populate({
                path: "recentlyViewed",
                options: { limit: parseInt(limit), sort: { updatedAt: -1 } }
            });
            return successResponseData(res, user?.recentlyViewed || [], 200, "Recently viewed");
        } catch (err) {
            return errorResponseData(res, "Failed to fetch recently viewed");
        }
    },

    // Product variants (mocked by variants array)
    getVariants: async (req, res) => {
        try {
            const product = await Product.findById(req.params.id);
            return successResponseData(res, product?.variants || [], 200, "Variants fetched");
        } catch (err) {
            return errorResponseData(res, "Failed to fetch variants");
        }
    },

    // Product availability
    checkAvailability: async (req, res) => {
        try {
            const { variantId } = req.query;
            const product = await Product.findById(req.params.id);
            if (!product) return errorResponseData(res, "Product not found");

            let availableStock = product.stock;
            // optionally handle variant-specific stock logic

            return successResponseData(res, { availableStock }, 200, "Stock availability");
        } catch (err) {
            return errorResponseData(res, "Failed to check availability");
        }
    },

    // Delivery options (mocked)
    getDeliveryOptions: async (req, res) => {
        try {
            const options = [
                { type: "Standard", time: "3-5 days", cost: 0 },
                { type: "Express", time: "1-2 days", cost: 50 },
            ];
            return successResponseData(res, options, 200, "Delivery options");
        } catch (err) {
            return errorResponseData(res, "Failed to fetch delivery options");
        }
    },

    // Compare product (mocked by fetching other products from same category)
    getCompareData: async (req, res) => {
        try {
            const { id } = req.params;
            const current = await Product.findById(id);
            if (!current) return errorResponseData(res, "Product not found");

            const similar = await Product.find({
                _id: { $ne: id },
                category: current.category
            }).limit(4);

            return successResponseData(res, {
                base: current,
                compareWith: similar
            }, 200, "Comparison data");
        } catch (err) {
            return errorResponseData(res, "Failed to compare products");
        }
    },


}
