'use strict';
const shopModel = require('../models/shop.model');
const bcrypt = require('bcryptjs');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair, verifyJWT } = require('../auth/authUtils');
const { getInfoData, generateKeyPair } = require('../utils');
const { RoleShop } = require('../constants/roles.shop');
const { BadRequestError, AuthFailureError, ForbiddenRequestError } = require('../core/error.response');
const { findByEmail } = require('./shop.service');
const { getRoleByName } = require('./rabc.service');
class AccessService {

  static logout = async (keyStore) => {
    return await KeyTokenService.removeKeyById(keyStore._id)
  }
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
    const role = await getRoleByName({ rol_name: RoleShop.SHOP });
    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [role._id],
    });

    if (newShop) {
      // create private key, public key
      const { privateKey, publicKey } = generateKeyPair()


      const token = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey,
      );
      // save collection keyStore
      await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
        refreshToken: token.refreshToken
      });

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

  static handleRefreshToken = async ({ refreshToken, user, keyStore }) => {
    const { userId, email } = user;
    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyById(userId)
      throw new ForbiddenRequestError('Something wrong happened!! Please login again')
    }

    if (keyStore.refreshToken !== refreshToken) {
      throw new AuthFailureError('Shop not registered')
    }

    // check user
    const foundShop = await findByEmail({ email })
    if (!foundShop) throw new AuthFailureError('Shop not registered')

    // create new token
    const token = await createTokenPair(
      { userId, email },
      keyStore.publicKey,
      keyStore.privateKey
    );

    // update token
    await keyStore.updateOne({
      $set: {
        refreshToken: token.refreshToken
      },
      $addToSet: {
        refreshTokensUsed: refreshToken
      }
    })

    return {
      user,
      token
    }
  }
}

module.exports = AccessService;
