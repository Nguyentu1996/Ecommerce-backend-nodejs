'use strict'
const express = require('express')
const routes = express.Router()
const { asyncHandle } = require('../../helpers/asyncHandle')
const { authentication } = require('../../auth/authUtils')
const productController = require('../../controllers/product.controller')

// authentication
routes.use(authentication)

// create product
routes.post('', asyncHandle(productController.createProduct))

module.exports = routes