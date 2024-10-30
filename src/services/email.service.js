'use strict';

const transport = require('../configs/nodemailer.config');
const OtpService = require('./otp.service');
const { renderTemplateToken } = require('../utils/tem.email');
const AppLogger = require("../loggers/winston.log");
const { NotFoundError } = require('../core/error.response');

// test service with https://ethereal.email/create
class EmailService {
    static async sendEmailToken({
        email = null
    }) {

        // 0. check token of email exists

        // 1 get token
        const token = await OtpService.newOtp({ email });
        // 2 get template
        const emailContent = await renderTemplateToken({
            email_name: email,
            link_verify: `http://localhost:3000/verify?token=${token.otp_token}`
        });

        if (!emailContent) {
            throw new NotFoundError('template mail not found')
        }
        // 3 send email
        EmailService.sendEmail({
            html: emailContent,
            toEmail: email,
            subject: 'Vui lòng xác nhận địa chỉ Email đăng ký!'
        });
    }
    
    static async sendEmail({
        html,
        toEmail,
        subject = 'Xác nhận email đăng ký!',
        text = 'Vui lòng xác nhận!'
    }) {
        try {
            const mailOptions = {
                from: '"Shop" <nguyentu19962710@gmail.com>',
                to: toEmail,
                subject,
                text,
                html
            }

            transport.sendMail(mailOptions, (err , info) => {
                if (err) {
                    AppLogger.error('Error sent mail:: ', err)
                    return console.error(err);
                }
                AppLogger.log('Message sent:: ', info.messageId)
                console.log('Message sent:: ', info.messageId)
            });
        } catch (err) {
            console.error('Error sent mail:: ', err)
            AppLogger.error('Error sent mail:: ', err)
            return err;
        }
    }
}

module.exports = EmailService;
