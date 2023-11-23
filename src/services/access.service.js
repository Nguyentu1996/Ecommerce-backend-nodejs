'use strict';
const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');
const { getInfoData, generateKeyPair } = require('../utils');
const { RoleShop } = require('../constants/roles.shop');
const { BadRequestError, AuthFailureError } = require('../core/error.response');
const { findByEmail } = require('./shop.service')
class AccessService {
  /*
    1 - check email in dbs
    2 - match password
    3 - create AccessToken, RefreshToken
    4 - generate Tokens
    5 - get data return
  */
  static login = async ({ email, password, refreshToken = null }) => {
    // 1.
    const foundShop = await findByEmail({ email })
    if (!foundShop) throw new BadRequestError('Error: Shop not registered!')

    // 2.
    const match = await bcrypt.compare(password, foundShop.password)
    if (!match) throw new AuthFailureError('Error: Authentication error!')

    // 3. create private key, public key
    const { privateKey, publicKey } = generateKeyPair()
    const { _id: userId } = foundShop;
    const token = await createTokenPair(
      { userId, email },
      publicKey,
      privateKey
    );

    // save collection keyStore
    await KeyTokenService.createKeyToken({
      userId,
      publicKey,
      privateKey,
      refreshToken: token.refreshToken
    });

    return {
      shop: getInfoData({
        fields: ['_id', 'name', 'email'],
        object: foundShop,
      }),
      token,
    };
  }

  static signUp = async ({ name, email, password }) => {
    // check email exists??
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError('Error: Shop already registered!')
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });

    if (newShop) {
      // create private key, public key
      const { privateKey, publicKey } = generateKeyPair()

      // save collection keyStore
      const publicKeyString = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
      });

      if (!publicKeyString) {
        throw new BadRequestError('Error: publicKeyString error !')
      }

      const publicKeyObject = crypto.createPublicKey(publicKeyString);

      const token = await createTokenPair(
        { userId: newShop._id, email },
        publicKeyObject,
        privateKey
      );

      return {
        shop: getInfoData({
          fields: ['_id', 'name', 'email'],
          object: newShop,
        }),
        token,
      };
    }

    return null;
  };
}

module.exports = AccessService;
