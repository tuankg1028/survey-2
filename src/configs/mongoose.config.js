const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
import mongoose from "mongoose";
import Utils from "../utils";
import MongooseCache from "mongoose-redis";

console.log("mongo1", process.env.MONGODB_URL);
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

mongoose.connection.on("error", err => {
  Utils.Logger.error(err);
});

mongoose.set("debug", true);

MongooseCache(
  mongoose,
  `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
);
