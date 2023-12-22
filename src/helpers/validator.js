'use strict'
const {
  StatusCodes,
} = require('../utils/httpStatusCode')

const validator = schema => () => {
  const {
    error
  } = schema.validate(req.body);
  if (error) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY)
      .send(error.details[0].message);
  } else {
    next();
  }
}

module.exports = {
  validator
}
