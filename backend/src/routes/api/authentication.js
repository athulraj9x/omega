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
router.get("/user_detail", userTokenAuth, getUserDetail);;

router.get('/profile', (req, res) => {
    res.send('Get user profile');
});

router.put('/profile', (req, res) => {
    res.send('Update user profile');
});

router.get('/addresses', (req, res) => {
    res.send('Get user addresses');
});

router.post('/addresses', (req, res) => {
    res.send('Add new address');
});

router.put('/addresses/:id', (req, res) => {
    res.send(`Update address ${req.params.id}`);
});

router.delete('/addresses/:id', (req, res) => {
    res.send(`Delete address ${req.params.id}`);
});



module.exports = router;

