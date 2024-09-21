'use strict'

const redis = require('redis')

let client = {}, statusConnect = {
    CONNECT: 'connect',
    END: 'end',
    RECONNECT: 'reconnect',
    ERROR: 'error'
}

const handleEventConnect = ({ connectionRedis }) => {
    connectionRedis.on(statusConnect.CONNECT, () => {
        console.log(`connection Redis status: connected`)
    })

    connectionRedis.on(statusConnect.END, () => {
        console.log(`connection Redis status: disconnected`)
    })

    connectionRedis.on(statusConnect.RECONNECT, () => {
        console.log(`connection Redis status: reconnecting`)
    })

    connectionRedis.on(statusConnect.ERROR, (err) => {
        console.log(`connection Redis status: error ${err}`)
    })
}

const initRedis = () => {
    const instanceRedis = redis.createClient();
    client.instanceConnect = instanceRedis;
    handleEventConnect({ connectionRedis: instanceRedis })
}

const getRedis = () => client

const closeRedis = async () => {
    await client?.instanceConnect?.disconnect();
}

module.exports = {
    initRedis,
    getRedis,
    closeRedis
}