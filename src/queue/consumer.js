const amqplib = require('amqplib');
const { rabbitMq: { url } } = require('../configs/connection.config.js')
const amqplib_url = url;

const receiveQueue = async () => {
    try {
        const queue = 'tasks';
        const conn = await amqplib.connect(amqplib_url);
        // create chanel
        const chanel = await conn.createChannel();
        // create name queue
        await chanel.assertQueue(queue, {
            durable: true
        });
        //send queue
        await chanel.consume(queue, msg => {
            console.log(`Message::`, msg.content.toString())
        });

    } catch (error) {
        console.error('Error::', error.message)
    }
}

module.exports = {
    receiveQueue,
}
