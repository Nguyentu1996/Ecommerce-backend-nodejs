'use strict'
const express = require('express')
const routes = express.Router()

routes.use('/v1/api', require('./access'))

module.exports = routes