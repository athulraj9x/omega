const redisClient = require("../config/redisClient");
const Constants = require("./Constants");
const Response = require("./Response");

module.exports = {

  getRedisBet: async (req, res) => {
    try {
      const REDISKEY = req.query.redisKey;
      const keys = await redisClient.keys(`${REDISKEY}`);
      if (keys.length > 0) {
        const regularBets = await Promise.all(
          keys.map((key) => redisClient.get(key))
        );

        redisBets = regularBets
          .filter((betData) => betData)
          .map((betData) => JSON.parse(betData));
      }
    } catch (error) {
      console.log({ error })
    }
  },
  saveBetToRedisAndDatabase: async (req, res) => {
    try {
      const REDISKEY = req.query.redisKey;
      const key = `${REDISKEY}`;
      const data = []
      await redisClient.set(key, JSON.stringify(data));
    } catch (err) {
      Response.errorResponseWithoutData(
        res,
        res.__("Internal Server Error"),
        Constants.INTERNAL_SERVER
      );
      throw err;
    }
  },
};
