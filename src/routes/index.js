'use strict'
const express = require('express')
const { checkApiKey, checkPermission } = require('../auth/checkAuth')
const router = express.Router()

// // check apiKey
// router.use(checkApiKey)
// // check permission
// router.use(checkPermission('0000'))

router.use('/v1/api/upload', require('./upload'))
router.use('/v1/api/checkout', require('./checkout'))
router.use('/v1/api/product', require('./product'))
router.use('/v1/api/discount', require('./discount'))
router.use('/v1/api/cart', require('./cart'))
router.use('/v1/api', require('./access'))
router.use('/v1/api/profile', require('./profile'))
router.use('/v1/api', require('./rabc'))
router.use('/v1/api/user', require('./user'))

module.exports = router;
