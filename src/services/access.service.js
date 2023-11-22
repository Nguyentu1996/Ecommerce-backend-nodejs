'use strict'
const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN'
}

class AccessService {
  static signUp = async (name, email, password) => { 
    try {
      // check email exists??
      const holderShop = await shopModel.findOne({ email }).lean()
      if (holderShop) {
        return {
          code: 'xxxx',
          messages: 'Shop already registered!'
        }
      }

      const passwordHash = await bcrypt.hash(password, 10)
      const newShop = await shopModel.create({
        name, email, passwordHash, roles: [RoleShop.SHOP]
      })

      if (newShop) {
        // create private key, public key
        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
          modulesLength: 4096
        })

        console.log({ privateKey, publicKey }) // save collection keyStore
      }

    } catch (error) {
      return {
        code: 'xxx',
        messages: error.messages,
        status: 'error'
      }
    }
  }
}

module.exports = AccessService
