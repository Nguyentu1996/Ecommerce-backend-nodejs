'use strict'

const { HEADER } = require('../constants/header.api');
const { findById } = require('../services/apiKey.service');
const checkApiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({
        message: 'Forbidden Error'
      })
    }
    // check object keys
    const objKey = await findById(key);
    if (!objKey) {
      return res.status(403).json({
        message: 'Forbidden Error'
      })
    }
    req.objKey = objKey
    return next()
  } catch (error) {

  }
}

const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({
        message: 'Permission denied'
      })
    }
    const validPermission = req.objKey.permissions.includes(permission)
    if (!validPermission) {
      return res.status(403).json({
        message: 'Permission denied'
      })
    }
    return next()
  }
}

module.exports = {
  checkApiKey,
  checkPermission,
}
