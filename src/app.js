require('dotenv').config();
const morgan = require('morgan')
const compression = require('compression');
const express = require('express')
const cors = require('cors')
const { default: helmet } = require('helmet')
const app = express();
const { v4: uuidv4 } = require('uuid');
const AppLogger = require('./loggers/winston.log');

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,POST,PUT,DELETE,PATCH',
  credentials: true,
  optionsSuccessStatus: 204
}

app.use(cors(corsOptions))

// init middlewares
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))


app.use((req, res, next) => {
  const requestId = req.header['x-request-id']
  req.requestId = requestId ? requestId : uuidv4()
  AppLogger.log(`Input params ::${req.method}`, [
    req.path,
    { requestId: req.requestId },
    req.method === 'POST' ? req.body : req.query
  ])
  next()
})

// init db
require('./dbs/init.mongodb')
const redis = require('./dbs/init.redis');
redis.initRedis();

// init Queue
const { sendQueue } = require('./queue/producer');
const { receiveQueue } = require('./queue/consumer');
sendQueue({ msg: 'Hello world' });
receiveQueue();

// init router
app.use('', require('./routes'))

// handing errors
app.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  const statusCode = error.status || 500
  const resMessage = `${statusCode} - ${Date.now() - error.now}ms - Response: ${JSON.stringify(error)}`
  AppLogger.error(resMessage, [
    req.path,
    { requestId: req.requestId },
    { message: error.message }
  ])

  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    stack: error.stack,
    message: error.message || 'Internal Server Error'
  })
})

module.exports = app