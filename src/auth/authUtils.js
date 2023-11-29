'use strict'

const JWT = require('jsonwebtoken')
const { HEADER } = require('../constants/header.api')
const { AuthFailureError, NotFoundError } = require('../core/error.response')
const KeyTokenService = require('../services/keyToken.service')
const { asyncHandle } = require('../helpers/asyncHandle')

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // access Token
    const accessToken = JWT.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '2 days'
    })

    // refresh Token
     const refreshToken = JWT.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '7 days'
    })

    // verify token
    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error(`Verify Errors::`, err)
      } else {
        console.log(`Decode Verify::`, decode)
      }
    })
    
    // console.log({ accessToken, privateKey })
    return { accessToken, refreshToken }
  } catch (error) {
    return error
  }
}

const authentication = asyncHandle(async (req, res, next) => {
  /*
    1- check userId missing
    2- get accessToken
    3- verify
    4- check user in db
    5- check keystore with userId
    6- OK all return next
  */
  const userId = req.headers[HEADER.CLIENT_ID]

  if (!userId) throw new AuthFailureError('Header is not defined')

  const keyStore = await KeyTokenService.findByUserId(userId)
  if (!keyStore) throw new NotFoundError('Not Found Keystore')


  const refreshToken = req.headers[HEADER.REFRESHTOKEN]
  if (refreshToken) {
    try {
      const decodeUser = JWT.verify(refreshToken, keyStore.privateKey)
      if (userId !== decodeUser.userId) throw AuthFailureError('Invalid user')
      req.keyStore = keyStore
      req.user = decodeUser
      req.refreshToken = refreshToken
      return next()
  
    } catch(error) {
      throw error
    }
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION]
  if (!accessToken) throw new AuthFailureError('Header is not defined')

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
    if (userId !== decodeUser.userId) throw AuthFailureError('Invalid user')
    req.keyStore = keyStore
    req.user = decodeUser
    return next()

  } catch(error) {
    throw error
  }
})

const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret)
}

module.exports = {
  createTokenPair,
  authentication,
  verifyJWT
}