const router = require("express").Router();
const adminRoute = require("./admin/admin");

// Admin router
router.use("/admin", adminRoute);

module.exports = router;
