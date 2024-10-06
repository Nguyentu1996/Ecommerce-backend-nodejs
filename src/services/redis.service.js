'use strict'

const { getRedis } = require("../dbs/init.redis");

const redisClient = getRedis()

const setCache = async (key, value) => {
    await redisClient.set(key, value);
}

const getCache = async (key) => {
    return await redisClient.get(key);
}

module.exports = {
    setCache,
    getCache
}