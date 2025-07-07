const redisClient = require("../config/redisClient");
const REDISKEY = process.env.REDIS_KEY;

module.exports = {
  saveToRedis: async (id, data) => {
    try {
      const key = `${REDISKEY}-${id}`;
      console.log({ key, data });
      await redisClient.set(key, JSON.stringify(data));
      console.log(`Bet "${id}" saved to Redis.`);
    } catch (err) {
      console.error("Error saving bet to Redis:", err);
    }
  },

  getFromRedis: async (id,keyWithPrefix = false) => {
    try {
      let key;
      if(keyWithPrefix){
        key = id
      }else{
        key = `${REDISKEY}-${id}`;
      }

      const data = await redisClient.get(key);
      if (data) {
        console.log(`Data for "${key}" retrieved from Redis.`);
        return JSON.parse(data);
      } else {
        console.log(`Data for "${key}" not found in Redis.`);
        return {}; // Return empty object instead of array
      }
    } catch (err) {
      console.error("Error retrieving data from Redis:", err);
      return {}; // Return empty object on error
    }
  },

  deleteFromRedis: async (id) => {
    try {
      const normalizedIds = id?.map((element) => element?.toString());
      console.log({normalizedIds})
      const deletePromises = normalizedIds.map(async (currentKey) => {
        const key = `${REDISKEY}-${currentKey}`;
        console.log({key})
        const result = await redisClient.del(key);
        console.log({result})
        if (result) {
          console.log(`"${currentKey}" deleted from Redis.`);
        } else {
          console.log(`"${currentKey}" not found in Redis.`);
        }
      });
      
      console.log({deletePromises})
      await Promise.all(deletePromises);
    } catch (err) {
      console.error("Error deleting from Redis:", err);
    }
  },

  deleteAllRedisCache: async () => {
    try {
      const keys = await redisClient.keys(`${REDISKEY}-*`);

      if (keys.length === 0) {
        console.log("Zero in Redis cache.");
        return;
      }

      await redisClient.del(keys);

      console.log(`Deleted ${keys.length} keys from Redis cache.`);
    } catch (err) {
      console.error("Error deleting all Redis cache:", err);
      throw err;
    }
  },
};
