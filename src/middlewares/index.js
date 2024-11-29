'use strict';
const AppLogger = require("../loggers/winston.log");
const { v4: uuidv4 } = require("uuid");

const logRequest = async (req, res, next) => {
  const requestId = req.header["x-request-id"];
  req.requestId = requestId ? requestId : uuidv4();
  AppLogger.log(`Input params ::${req.method}`, [
    req.path,
    { requestId: req.requestId },
    req.method === "POST" ? req.body : req.query,
  ]);
  next();
}

const appNotFoundError = async (req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
}

const appHandlerError = async (error, req, res, next) => {
  const statusCode = error.status || 500;
  const resMessage = `${statusCode} - ${Date.now() - error.now}ms - Response: ${JSON.stringify(error)}`;

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
}

module.exports = {
  logRequest,
  appHandlerError,
  appNotFoundError,
}