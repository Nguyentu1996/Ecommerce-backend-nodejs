'use strict'
const { model, Schema, Types } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Notification';
const COLLECTION_NAME = 'Notifications';

const NotificationSchema = Schema({
   notice_type: { type: String, enum: ['ORDER', 'PROMOTION', 'SHOP'], required: true },
   notice_senderId: { type: Types.ObjectId, required: true, ref: 'Shop' },
   notice_receivedId: { type: Number, required: true },
   notice_content: { type: String, required: true },
   notice_options: { type: String, default: {} },
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
})

module.exports = model(DOCUMENT_NAME, NotificationSchema)
