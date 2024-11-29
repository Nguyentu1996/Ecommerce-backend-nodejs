require('dotenv').config();
const morgan = require('morgan')
const compression = require('compression');
const express = require('express')
const cors = require('cors')
const { default: helmet } = require('helmet')
const app = express();
const { logRequest, appNotFoundError, appHandlerError } = require('./middlewares');
const AppRateLimiter = require('./middlewares/rateLimit.middleware');
const routes = require('./routes');
const redis = require("./dbs/init.redis");

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

require("./dbs/init.mongodb");
redis.initRedis();

app.use(logRequest)
app.use(AppRateLimiter({ endpoint: 'app' }))
app.use("", routes);
app.use(appNotFoundError)
app.use(appHandlerError)

module.exports = app