'use strict'

const redis = require('redis')
const redisClient = redis.createClient()
redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});


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