'use strict'

const { getRedis } = require("../dbs/init.redis");

const redisClient = getRedis()

const setCache = async (key, value) => {
    await redisClient.instanceConnect.set(key, value);
}

const setListCache = async (key, value = []) => {
    await redisClient.instanceConnect.rPush(key, JSON.stringify(value));
}

const increaseCache = async (key) => {
    return await redisClient.instanceConnect.incr(key);
}

const setExpireCache = async (key, time) => {
    await redisClient.instanceConnect.pExpire(key, Number(time))
}

const getListCache = async (key) => {
    const listItems = await redisClient.instanceConnect.lRange(key, 0, -1);
    return listItems.map(item => JSON.parse(item));
}

const getCache = async (key) => {
    return await redisClient.instanceConnect.get(key);
}

module.exports = {
    setCache,
    getCache,
    setListCache,
    getListCache,
    increaseCache,
    setExpireCache
}