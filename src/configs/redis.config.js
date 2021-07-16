import redis from "redis";
import Utils from "../utils";

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});

redisClient.select(0);

redisClient.on("connect", () => {
  Utils.Logger.info("💗  Redis client connected");
});

redisClient.on("error", err => {
  Utils.Logger.info("Something went wrong " + err);
});

export default redisClient;

