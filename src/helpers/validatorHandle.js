'use strict'
const { UnProcessableError } = require('../core/error.response');

const validatorHandle = schema => (req, res, next) => {
  const {
    error
  } = schema.validate(req.body);
  if (error) {
    throw new UnProcessableError(error.details[0].message)
  } else {
    next();
  }
}

module.exports = {
  validatorHandle
}
