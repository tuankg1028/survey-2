const path = require("path");
// require("child_process").spawn("node", ["app.js"]);
require("dotenv").config({ path: path.join(__dirname, "../.env") });
import Utils from "./utils";
import "./configs/mongoose.config";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import frameguard from "frameguard";
import requestIp from "request-ip";

const Sentry = require("@sentry/node");
const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const redisClient = require("./configs/redis.config").default;
var MongoDBStore = require("connect-mongodb-session")(session);
// const redisStore = require("connect-redis")(session);

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express();
// const store = new redisStore({
//   client: redisClient,
//   ttl: 86400
// });

// const store = new MongoDBStore({
//   uri: process.env.MONGODB_URL,
//   connectionOptions: {
//     useUnifiedTopology: true,
//     auth: {
//       user: process.env.MONGODB_USERNAME,
//       password: process.env.MONGODB_PASSWORD
//     }
//   },
//   collection: "session"
// });
// view engine setup
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");
app.use(requestIp.mw());
app.use(cors());
app.use(
  frameguard({ action: "allow-from", domain: "https://ttv.microworkers.com" })
);
app.use(compression());
app.use(logger("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb"
  })
);
app.use(cookieParser());
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "somesecret",
    cookie: { maxAge: 60000 * 60 * 12 } // 12h
    // store
  })
);
Sentry.init({
  dsn:
    "https://b5ac925f14564fe3a19315362582f9ce@o378215.ingest.sentry.io/5201298"
});

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

app.use(express.static(path.join(__dirname, "../public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use(Sentry.Handlers.errorHandler());
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  Utils.Logger.info("Server listening on " + PORT);
});
