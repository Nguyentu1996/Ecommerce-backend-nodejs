'use strict'
const express = require('express')
const routes = express.Router()
const { asyncHandle } = require('../../helpers/asyncHandle')
const uploadController = require('../../controllers/upload.controller')
const { uploadDisk, uploadMemory } = require('../../configs/multer.config')
const { authentication } = require('../../auth/authUtils')

routes.post('/product/thumb', authentication, uploadDisk.single('file'), asyncHandle(uploadController.uploadImageLocal))
routes.post('/product/thumb/multiple', authentication, uploadDisk.array('files', 3), asyncHandle(uploadController.uploadImageLocalMultipleFiles))
routes.post('/product/bucket', authentication, uploadMemory.single('file'), asyncHandle(uploadController.uploadImageLocalS3))

module.exports = routes