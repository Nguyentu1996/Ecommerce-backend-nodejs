'use strict'
const dev = {
  app: {
    port: process.env.DEV_APP_PORT
  },
  db: {
    host: process.env.DEV_DB_HOST,
    port: process.env.DEV_DB_PORT,
    name: process.env.DEV_DB_NAME,
  },
  redis: {
    host: process.env.DEV_REDIS_HOST,
    port: process.env.DEV_REDIS_PORT,
  },
  rabbitMq: {
    url: process.env.DEV_RABBITMQ_URL
  },
  cloudinary: {
    api_key: process.env.DEV_CLOUDINARY_API_KEY,
    cloud_name: process.env.DEV_CLOUDINARY_NAME,
    api_secret: process.env.DEV_CLOUDINARY_API_SECRET,
  }
}
const pro = {
  app: {
    port: process.env.PRO_APP_PORT
  },
  db: {
    host: process.env.PRO_DB_HOST,
    port: process.env.PRO_DB_PORT,
    name: process.env.PRO_DB_NAME,
  }
}
const config = { dev, pro }
const env = process.env.NODE_ENV || 'dev'
module.exports = config[env]
