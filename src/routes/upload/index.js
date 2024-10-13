'use strict'
const express = require('express')
const routes = express.Router()
const { asyncHandle } = require('../../helpers/asyncHandle')
const uploadController = require('../../controllers/upload.controller')
const { uploadDisk } = require('../../configs/multer.config')

routes.post('/product/thumb', uploadDisk.single('file'), asyncHandle(uploadController.uploadImageLocal))
routes.post('/product/thumb/multiple', uploadDisk.array('files', 3), asyncHandle(uploadController.uploadImageLocalMultipleFiles))


module.exports = routes