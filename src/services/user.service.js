'use strict';

const { ErrorResponse, AuthFailureError } = require('../core/error.response');
const userModel = require('../models/user.model');
const { createTempUser } = require('../repositories/user.repo');
const EmailService = require('./email.service');
const bcrypt = require('bcryptjs');
const uniqueSlug = require('unique-slug');
const { getRoleByName } = require('./rabc.service');
const { RoleShop } = require('../constants/roles.shop');
const OtpService = require('./otp.service');
const { renderTemplateWelcome } = require('../utils/tem.email');
const { generateKeyPair, getInfoData } = require('../utils');
const { createTokenPair } = require('../auth/authUtils');
const KeyTokenService = require('./keyToken.service');
class UserService {
    static async newUser({
        email = null,
        captcha = null
    }) {
        // 1. check email exists in dbs

        const user = await userModel.findOne({ email }).lean();

        if (user) {
            throw new ErrorResponse('Email already exists');
        }

        // 2. send mail
        await EmailService.sendEmailToken({ email });
        return { message: 'verify email token'}
    }

    static async newTempUser({ usr_email }) {
        try {
            const passwordHash = await bcrypt.hash(usr_email, 10);
            const randomSlug = uniqueSlug();
            const foundRole = await getRoleByName({ rol_name: RoleShop.USER });
            const newUser = await createTempUser({
                usr_email: usr_email,
                usr_slug: randomSlug,
                usr_password: passwordHash,
                usr_role: foundRole._id
            });
            return newUser;
        } catch (err) {
            console.log({err})
        }
    }

    static async userVerifyEmailToken({
        verify_token
    }) {
        // 1 get token
        const foundToken = await OtpService.getOtpToken({ verify_token });
        if (!foundToken) throw new AuthFailureError('Email not registration');
        // create new user temp
        const newUser = await UserService.newTempUser({ usr_email: foundToken.otp_email });
        if (!newUser) throw new ErrorResponse('User not registration');
        
        // update status token 
        foundToken.otp_status = 'active';
        await foundToken.save();

        // create private key, public key
        const { privateKey, publicKey } = generateKeyPair()
        const token = await createTokenPair(
            { userId: newUser._id, email: newUser.usr_email },
            publicKey,
            privateKey,
        );

        // save collection keyStore
        await KeyTokenService.createKeyToken({
            userId: newUser._id,
            publicKey,
            privateKey,
            refreshToken: token.refreshToken
        });

        // send mail with temp password
        const emailContent = await renderTemplateWelcome({
            email_name: foundToken.usr_email,
            password: tempUser.usr_password
        });

        EmailService.sendEmail({
            html: emailContent,
            toEmail: foundToken.otp_email,
            subject: 'Thong tin dang nhap email đăng ký!',
            text: 'Thong tin dang nhap email đăng ký!'
        });

        return {
            user: getInfoData({
                fields: ['_id', 'usr_slug', 'usr_email'],
                object: newUser,
            }),
            token,
        };

    }
}

module.exports = UserService
