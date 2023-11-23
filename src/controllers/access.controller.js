'use strict'

const AccessService = require('../services/access.service')
const { OK, CREATED } = require('../core/success.response')
class AccessController {
  login = async (req, res, next) => {
    new OK({
      message: 'Login Success',
      metadata: await AccessService.login(req.body),
    }).send(res)
  }
  signUp = async (req, res, next) => {
    console.log(`[P]::sign up`, req.body)
    new CREATED({
      message: 'Registered Success',
      metadata: await AccessService.signUp(req.body),
      options: {} // options response
    }).send(res)
  }
}

module.exports = new AccessController();
