'use strict'

const JWT = require('jsonwebtoken')

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
    
    console.log({ accessToken, privateKey })
    return { accessToken, refreshToken }
  } catch (error) {
    return error
  }
}

module.exports = {
  createTokenPair 
}