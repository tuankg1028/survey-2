import chalk from "chalk";

export default {
  info: msg => {
    // eslint-disable-next-line no-console
    console.log(chalk.bgGreen.black(msg));
  },
  error: err => {
    // eslint-disable-next-line no-console
    console.log(chalk.whiteBright.bgRed(err));

    // log to sentry
    // if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test") {
    //   Sentry.captureMessage(err, "error");
    // }
  }
};
