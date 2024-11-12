'use strict'
const { Client } = require('@elastic/elasticsearch');

let clients = {}

const instanceEventListeners = async (elasticClient) => {
    try {
        await elasticClient.ping()
        console.log(`Successfully connected elasticsearch`);
    } catch (err) {
        console.error(`Error connecting elasticsearch`, err);
    }
}

const init = ({
    ELASTICSEARCH_ENABLED,
    ELASTICSEARCH_HOST = 'http://localhost:9200',
}) => {
    if (ELASTICSEARCH_ENABLED) {
        const elasticClient = new Client({ node: ELASTICSEARCH_HOST });
        clients.elasticClient = elasticClient;

        // handle connect
        instanceEventListeners(elasticClient);
    }
}

const getClients = () => clients

module.exports = {
    init,
    getClients
}