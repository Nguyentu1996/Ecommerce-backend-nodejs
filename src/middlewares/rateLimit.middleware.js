'use strict';

const { ErrorResponse } = require('../core/error.response');
const { increaseCache, setExpireCache } = require('../services/redis.service');

// Define the rate limit and time window
const RATE_LIMIT = process.env.APP_RATE_LIMIT; // max requests
const WINDOW_TIME = process.env.APP_WINDOW_TIME; // 1 minute in milliseconds

const AppRateLimiter = ({
  endpoint = '', 
  rate_limit = { 
    time: WINDOW_TIME,
    limit: RATE_LIMIT
  } 
}) => {
  return async (req, res, next) => {
    try {
      const userKey = `${endpoint}${req.ip || '128.0.0.1'}`; // use IP address as the identifier
      const requestCount = await increaseCache(userKey);
      if (requestCount === 1) {
        await setExpireCache(userKey, rate_limit.time)
      }
      if (requestCount > Number(rate_limit.limit)) {
        throw new ErrorResponse("Server busy. Please try again later.", 503)
      }
      console.log({ requestCount });
      next()
    } catch (err) {
      next(err)
    }
  }
}

module.exports = AppRateLimiter
