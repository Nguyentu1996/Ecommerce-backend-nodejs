'use strict'
const express = require('express')
const routes = express.Router()
const { asyncHandle } = require('../../helpers/asyncHandle')
const { authentication } = require('../../auth/authUtils')
const accessController = require('../../controllers/access.controller')

// signUp
routes.post('/shop/signup', asyncHandle(accessController.signUp))
routes.post('/shop/login', asyncHandle(accessController.login))

// authentication
routes.post('/shop/logout', authentication, asyncHandle(accessController.logout))
routes.post('/shop/handleRefreshToken', authentication, asyncHandle(accessController.handleRefreshToken))

module.exports = routes;