'use strict'

const { model, Schema, Types } = require('mongoose'); // Erase if already required
const DOCUMENT_NAME = 'otp_log'
const COLLECTION_NAME = 'otp_logs'

const optSchema = new Schema({
    otp_token: { type: String, required: true }, 
    otp_email: { type: String, required: true },
    otp_status: { type: String, default: 'pending', enum: ['pending', 'active', 'block'] },
    // expireAt: { 
    //     type: Date,
    //     default: Date.now,
    //     expires: 60 * 3600
    // },
},
{
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, optSchema);
