const router = require("express").Router();
const connect = require("connect");
const { adminTokenAuth } = require("../../middlewares/admin");

const {
  login,
  resetPassword,
  logout,
} = require("../../controllers/admin/authController");
const {
  addBanner,
  getBanners,
  updateSliderStatus,
  deleteSlider,
} = require("../../controllers/admin/homeController");



router.post("/login", login);
router.post("/reset-password", adminTokenAuth, resetPassword);
router.post("/logout", adminTokenAuth, logout);

router.post("/add-home-slider", adminTokenAuth, addBanner);
router.post("/home-sliders", adminTokenAuth, getBanners);
router.put("/home-slider", adminTokenAuth, updateSliderStatus);
router.delete("/home-slider/:id", adminTokenAuth, deleteSlider);


module.exports = router;
