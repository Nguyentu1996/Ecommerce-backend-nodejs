'use strict';

const Notification = require('../models/notification.model');

class NotificationService {

    static pushNoticeToSystem = async ({
        type = 'SHOP',
        receiverId = 1,
        senderId = 1,
        options = {}
    }) => {

        let notice_content
        if (type === 'SHOP') {
            notice_content = `Vua moi them 1 san pham`
        }
        const new_notice = await Notification.create({
            notice_content,
            notice_type: type,
            notice_senderId: senderId,
            notice_receivedId: receiverId,
            notice_options: options
        })
        return new_notice
    }
}

module.exports = NotificationService;
