'use strict'
const userModel = require('../models/user.model');

const createTempUser = async ({ usr_email, usr_password, usr_slug }) => {
    return await userModel.create({ 
        usr_email,
        usr_password,
        usr_slug,
        usr_status: 'active'
    })
}

module.exports = {
    createTempUser
}