'use strict'

const cloudinaryV2 = require('cloudinary').v2;
const { cloudinary: { api_key, api_secret, cloud_name } } = require('../configs/connection.config')

cloudinaryV2.config({
  cloud_name,
  api_key,
  api_secret,
  secure: true,
});

module.exports = cloudinaryV2;
