'use strict'
const express = require('express')
const accessController = require('../../controllers/access.controller')
const routes = express.Router()
const { asyncHandle } = require('../../helpers/asyncHandle')
const { authentication } = require('../../auth/authUtils')
// signUp
routes.post('/shop/signup', asyncHandle(accessController.signUp))
routes.post('/shop/login', asyncHandle(accessController.login))

// authentication
routes.use(authentication)
// logout 
routes.post('/shop/logout', asyncHandle(accessController.logout))
routes.post('/shop/handleRefreshToken', asyncHandle(accessController.handleRefreshToken))



module.exports = routes