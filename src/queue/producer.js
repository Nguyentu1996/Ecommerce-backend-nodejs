const amqplib = require('amqplib');
const { rabbitMq: { url } } = require('../configs/connection.config.js')
const amqplib_url = url;

const sendQueue = async ({ msg }) => {
    try {
        const queue = 'tasks';
        const conn = await amqplib.connect(amqplib_url);
        // create chanel
        const chanel = await conn.createChannel();
        // create name queue
        await chanel.assertQueue(queue, {
            durable: true
        });
        console.log(`Queue '${queue}' is asserted as durable`);
        //send queue
        await chanel.sendToQueue(queue, Buffer.from(msg));

    } catch (error) {
        console.error('Error::', error.message)
    }

}

module.exports = {
    sendQueue,
}
