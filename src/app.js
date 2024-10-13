require('dotenv').config();
const morgan = require('morgan')
const compression = require('compression');
const express = require('express')
const cors = require('cors')
const { default: helmet } = require('helmet')
const app = express();
const bootstrap = require('./bootstrap');

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

bootstrap(app);

module.exports = app