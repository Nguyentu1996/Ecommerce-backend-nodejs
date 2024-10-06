const amqplib = require('amqplib');
const { rabbitMq: { url } } = require('../configs/connection.config.js')
const amqplib_url = url;

const sendQueueOrdered = async () => {
    try {
        const queue = 'ordered-message';
        const conn = await amqplib.connect(amqplib_url);
        // create chanel
        const chanel = await conn.createChannel();
        // create name queue
        await chanel.assertQueue(queue, {
            durable: true
        });

        //send queue
        for (let index = 0; index < 10; index++) {
            const message = `Message ordered ${index}`;
            chanel.sendToQueue(queue, Buffer.from(message), {
                // expiration: '10000', // TTL time to live 10s
                persistent: true
            });
        }

        setTimeout(() => {
            conn.close();
        }, 500)

    } catch (error) {
        console.error('Error::', error.message)
    }

}
module.exports = {
    sendQueueOrdered,
}
