'use strict';

const { randomInt } = require('crypto');
const otpModel = require('../models/otp.model');

class OtpService {
    static async newOtp({ email }) {
        const token = OtpService.generatorTokenRandom();
        const newToken = await otpModel.create({
            otp_token: token,
            otp_email: email
        });
        return newToken;
    }

    static async getOtpToken({ verify_token }) {
        const foundToken = await otpModel.findOne({
            otp_token: verify_token,
            otp_status: 'pending'
        })
        return foundToken;
    }

    static generatorTokenRandom() {
        const token = randomInt(0, Math.pow(2, 32));
        return token
    }
}

module.exports = OtpService