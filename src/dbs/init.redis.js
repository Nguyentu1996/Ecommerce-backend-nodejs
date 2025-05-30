'use strict'

const { createClient } = require('redis')
const { redis: { host, port } } = require('../configs/connection.config.js')
const { RedisConnectionError } = require('../core/error.response')

let client = {}, statusConnect = {
    CONNECT: 'connect',
    END: 'end',
    RECONNECT: 'reconnecting',
    ERROR: 'error'
}, connectionTimeout

const REDIS_CONNECT_TIMEOUT = 10000, REDIS_CONNECT_MESSAGE = {
    code: -99,
    message: 'service redis connect error'
}

const handleTimeoutError = () => {
    connectionTimeout = setTimeout(() => {
        throw new RedisConnectionError({
            message: REDIS_CONNECT_MESSAGE.message,
            statusCode: REDIS_CONNECT_MESSAGE.code
        })
    }, REDIS_CONNECT_TIMEOUT)
}

const handleEventConnect = ({ connectionRedis }) => {
    connectionRedis.connect();
    client.instanceConnect = connectionRedis;

    connectionRedis.on(statusConnect.CONNECT, () => {
        console.log(`connection Redis status: connected`);
        if (connectionTimeout)
            clearTimeout(connectionTimeout);
    })

    connectionRedis.on(statusConnect.END, () => {
        console.log(`connection Redis status: disconnected`)
        handleTimeoutError()
    })

    connectionRedis.on(statusConnect.RECONNECT, () => {
        console.log(`connection Redis status: reconnecting`);
        if (connectionTimeout)
            clearTimeout(connectionTimeout);
    })

    connectionRedis.on(statusConnect.ERROR, (error) => {
        console.log(`connection Redis status: error ${error}`)
        handleTimeoutError()
    });
}

const initRedis = () => {
    if (!client.instanceConnect) {
        console.log(`connecting redis: redis://${host}:${port}`);
        const instanceRedis = createClient({
            url: `redis://${host}:${port}`
        });
        handleEventConnect({ connectionRedis: instanceRedis })
    }
}

const getRedis = () => client;

const closeRedis = async () => {
    await client?.instanceConnect?.disconnect();
}

module.exports = {
    initRedis,
    getRedis,
    closeRedis
}