const router = require("express").Router();
const connect = require("connect");
const { userTokenAuth } = require("../../middlewares/user");
const { MobileGetLatestData } = require("../../controllers/app/mobileController");


const authMiddleware = (() => {
  const chain = connect();
  [userTokenAuth].forEach((middleware) => {
    chain.use(middleware);
  });
  return chain;
})();

//lrf
router.get("/refresh",MobileGetLatestData);

module.exports = router;
