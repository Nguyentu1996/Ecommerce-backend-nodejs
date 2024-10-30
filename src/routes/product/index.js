'use strict'
const express = require('express')
const routes = express.Router()
const { asyncHandle } = require('../../helpers/asyncHandle')
const { authentication } = require('../../auth/authUtils')
const productController = require('../../controllers/product.controller')

routes.get('/search/:keyword', asyncHandle(productController.getListSearchProduct))
routes.get('/:productId', asyncHandle(productController.findProduct))
routes.get('', asyncHandle(productController.findAllProducts))


// authentication

routes.post('',authentication, asyncHandle(productController.createProduct))
routes.patch('/:productId', authentication, asyncHandle(productController.updateProduct))

routes.post('/publish/:id', authentication, asyncHandle(productController.publishProductByShop))
routes.get('/unPublish/:id', authentication, asyncHandle(productController.unPublishProductByShop))

// QUERY //
routes.get('/draft/all', authentication, asyncHandle(productController.getAllDraftForShop))
routes.get('/publish/all', authentication, asyncHandle(productController.getAllPublishForShop))


module.exports = routes