require('dotenv').config();
const morgan = require('morgan')
const compression = require('compression');
const express = require('express')
const { default: helmet } = require('helmet')
const app = express();

// init middlewares
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())

// init db
require('./dbs/init.mongodb')
const { countConnect } = require('./helpers/check.connect')
countConnect();

// init router
app.use('', require('./routes'))

// handing errors

module.exports = app