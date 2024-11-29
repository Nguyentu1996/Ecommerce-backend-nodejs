'use strict'

const UserService = require('../services/user.service');
const { SuccessResponse } = require('../core/success.response');

class UserController {
  newUser = async (req, res, next) => {
    new SuccessResponse({
      message: 'Registered Success',
      metadata: await UserService.newUser(req.body),
      options: {} // options response
    }).send(res)
  }
  verifyEmailToken = async (req, res, next) => {
    new SuccessResponse({
      message: 'Registered Success',
      metadata: await UserService.userVerifyEmailToken({ verify_token: req.query.token }),
      options: {} // options response
    }).send(res)
    
  }
}

module.exports = new UserController();
