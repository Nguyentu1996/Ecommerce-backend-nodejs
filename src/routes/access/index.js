'use strict'
const express = require('express')
const accessController = require('../../controllers/access.controller')
const routes = express.Router()
const { asyncHandle } = require('../../auth/checkAuth')
// signUp
routes.post('/shop/signup', asyncHandle(accessController.signUp))
routes.post('/shop/login', asyncHandle(accessController.login))


module.exports = routes