'use strict'

const {
  StatusCodes,
  ReasonPhrases,
} = require('../utils/httpStatusCode')
class ErrorResponse extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
    this.now = Date.now();
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(message = ReasonPhrases.CONFLICT, statusCode = StatusCodes.CONFLICT) {
    super(message, statusCode)
  }
}

class BadRequestError extends ErrorResponse {
  constructor(message = ReasonPhrases.BAD_REQUEST, statusCode = StatusCodes.BAD_REQUEST) {
    super(message, statusCode)
  }
}
class ForbiddenRequestError extends ErrorResponse {
  constructor(message = ReasonPhrases.FORBIDDEN, statusCode = StatusCodes.FORBIDDEN) {
    super(message, statusCode)
  }
}
class AuthFailureError extends ErrorResponse {
  constructor(message = ReasonPhrases.UNAUTHORIZED, statusCode = StatusCodes.UNAUTHORIZED) {
    super(message, statusCode)
  }
}

class NotFoundError extends ErrorResponse {
  constructor(message = ReasonPhrases.NOT_FOUND, statusCode = StatusCodes.NOT_FOUND) {
    super(message, statusCode)
  }
}

class UnProcessableError extends ErrorResponse {
  constructor(message = ReasonPhrases.UNPROCESSABLE_ENTITY, statusCode = StatusCodes.UNPROCESSABLE_ENTITY) {
    super(message, statusCode)
  }
}

class RedisConnectionError extends ErrorResponse {
  constructor(message = ReasonPhrases.INTERNAL_SERVER_ERROR, statusCode = StatusCodes.INTERNAL_SERVER_ERROR) {
    super(message, statusCode)
  }
}

module.exports = {
  ConflictRequestError,
  BadRequestError,
  AuthFailureError,
  NotFoundError,
  ForbiddenRequestError,
  UnProcessableError,
  RedisConnectionError,
  ErrorResponse,
}