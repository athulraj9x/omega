const router = require("express").Router();
const { deposit, withDraw, checkBalance } = require("../../controllers/bot/transaction");
const { checkUsername, createId, resetPassword } = require("../../controllers/bot/user");

//lrf
router.post("/check-username", checkUsername);
router.post("/create-id", createId);
router.post("/reset-pass", resetPassword);
router.post("/deposit", deposit);
router.get("/check-balance", checkBalance);
router.post("/withdraw", withDraw);

module.exports = router;
