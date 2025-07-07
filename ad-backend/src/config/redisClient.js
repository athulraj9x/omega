const redis = require("redis");

const redisHost = process.env.SOCKET_REDIS_HOST;
const redisPort = process.env.SOCKET_REDIS_PORT;

const redisClient = redis.createClient({
  url: `redis://${redisHost}:${redisPort}`
});

redisClient.on("connect", () => {
  console.log("Connected to Redis.");
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

(async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (err) {
    console.error("Error connecting to Redis:", err);
  }
})();

module.exports = redisClient;
