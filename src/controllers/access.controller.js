'use strict'

const AccessService = require('../services/access.service')
const { CREATED, SuccessResponse } = require('../core/success.response')
class AccessController {
  logout = async (req, res, next) => {
    new SuccessResponse({
      message: 'Logout Success',
      metadata: await AccessService.logout(req.keyStore),
    }).send(res)
  }

  login = async (req, res, next) => {
    new SuccessResponse({
      message: 'Login Success',
      metadata: await AccessService.login(req.body),
    }).send(res)
  }

  signUp = async (req, res, next) => {
    new CREATED({
      message: 'Registered Success',
      metadata: await AccessService.signUp(req.body),
      options: {} // options response
    }).send(res)
  }

  handleRefreshToken = async (req, res, next) => {
    new SuccessResponse({
      message: 'Logout Success',
      metadata: await AccessService.handleRefreshToken({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore
      }),
    }).send(res)
  }
}

module.exports = new AccessController();
