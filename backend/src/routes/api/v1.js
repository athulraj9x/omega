const router = require("express").Router();
const { login, forgotPassword, resetPassword, logout } = require("../../controllers/app/authController");
const { userRegistration, verifyEmail, resendOtp, getUserName, getUserDetail } = require("../../controllers/app/userController");
const { userTokenAuth } = require("../../middlewares/user");

//lrf
router.post("/login", login);
router.post("/forgot_password", forgotPassword);
router.post("/reset_password", resetPassword);
router.post("/logout", logout);

//user
router.post("/registration", userRegistration);
router.post("/email_verify", verifyEmail);
router.post("/resend_otp", resendOtp);
router.get("/username", getUserName);
router.get("/user_detail", userTokenAuth, getUserDetail);


module.exports = router;

