const amqplib = require('amqplib');
const { rabbitMq: { url } } = require('../configs/connection.config.js')
const amqplib_url = url;

const sendQueueDLX = async ({ msg }) => {
    try {
        const conn = await amqplib.connect(amqplib_url);
        // create chanel
        const chanel = await conn.createChannel();

        const noticeExchange = 'noticeEX' // notice direct
        const noticeQueue = 'noticeQueueProcess' // assert queue
        const noticeExchangeDLX = 'noticeExDLX' // notice EX direct
        const noticeRoutingKeyDLX = 'noticeRoutingKeyExDLX' //assert

        // create exchange
        await chanel.assertExchange(noticeExchange, 'direct', { durable: true })
        // create name queue
        const queueResult = await chanel.assertQueue(noticeQueue, {
            exclusive: false, // allow connect from other connection 
            deadLetterExchange: noticeExchangeDLX,
            deadLetterRoutingKey: noticeRoutingKeyDLX
        });

        // bind queue
        await chanel.bindQueue(queueResult.queue, noticeExchange);

        //send message 
        await chanel.sendToQueue(queueResult.queue, Buffer.from(msg), {
            expiration: '10000', // TTL time to live 10s
            persistent: true
        });

        setTimeout(() => {
            conn.close();
        }, 500)
    } catch (error) {
        console.error('Error::', error.message)
    }

}
module.exports = {
    sendQueueDLX,
}
