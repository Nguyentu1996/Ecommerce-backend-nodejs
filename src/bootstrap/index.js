const redis = require("../dbs/init.redis");
const AppLogger = require("../loggers/winston.log");
const { v4: uuidv4 } = require("uuid");
const router = require("../routes")

class BootstrapApp {
  constructor(app) {
    this.app = app;
    this.initApp();
  }

  initApp() {
    this.connectDatabase();
    this.initMiddlerWare();
    this.initRouter();
    this.appHandlerError();
  }

  connectDatabase() {
    require("../dbs/init.mongodb");
    redis.initRedis();
  }

  initMiddlerWare() {
    this.app.use((req, res, next) => {
      const requestId = req.header["x-request-id"];
      req.requestId = requestId ? requestId : uuidv4();
      AppLogger.log(`Input params ::${req.method}`, [
        req.path,
        { requestId: req.requestId },
        req.method === "POST" ? req.body : req.query,
      ]);
      next();
    });
  }

  initRouter() {
    this.app.use("", router);
  }

  appHandlerError() {
    // handing errors
    this.app.use((req, res, next) => {
      const error = new Error("Not Found");
      error.status = 404;
      next(error);
    });

    this.app.use((error, req, res, next) => {
      const statusCode = error.status || 500;
      const resMessage = `${statusCode} - ${
        Date.now() - error.now
      }ms - Response: ${JSON.stringify(error)}`;
      AppLogger.error(resMessage, [
        req.path,
        { requestId: req.requestId },
        { message: error.message },
      ]);

      let responseError = {
        status: "error",
        code: statusCode,
        message: error.message || "Internal Server Error",
      };

      if (process.env.NODE_ENV !== "pro") {
        responseError = { ...responseError, stack: error.stack };
      }
      return res.status(statusCode).json(responseError);
    });
  }

}

const bootstrap = (app) => new BootstrapApp(app);
module.exports = bootstrap;
