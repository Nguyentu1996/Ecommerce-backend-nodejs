'use strict'
const express = require('express')
const routes = express.Router()
const { asyncHandle } = require('../../helpers/asyncHandle')
const { authentication } = require('../../auth/authUtils')
const productController = require('../../controllers/product.controller')

routes.get('/search/:keyword', asyncHandle(productController.getListSearchProduct))
routes.get('', asyncHandle(productController.findAllProducts))

// authentication
routes.use(authentication)

routes.post('', asyncHandle(productController.createProduct))

routes.post('/publish/:id', asyncHandle(productController.publishProductByShop))
routes.get('/unPublish/:id', asyncHandle(productController.unPublishProductByShop))

// QUERY //
routes.get('/draft/all', asyncHandle(productController.getAllDraftForShop))
routes.get('/publish/all', asyncHandle(productController.getAllPublishForShop))


module.exports = routes