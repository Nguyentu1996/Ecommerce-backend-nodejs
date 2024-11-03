'use strict'

const { getRedis } = require("../dbs/init.redis");

const redisClient = getRedis()

const setCache = async (key, value) => {
    await redisClient.set(key, value);
}

const setListCache = async (key, value = []) => {
    await redisClient.rPush(key, JSON.stringify(value)); // 60 minutes
}

const getListCache = async (key) => {
    const listItems = await redisClient.lRange(key, 0, -1);
    return listItems.map(item => JSON.parse(item));
}

const getCache = async (key) => {
    return await redisClient.get(key);
}

module.exports = {
    setCache,
    getCache,
    setListCache,
    getListCache,
}