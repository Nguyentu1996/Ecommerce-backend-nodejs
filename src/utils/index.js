'use strict'

const { pick, omitBy, isNil } = require('lodash')
const crypto = require('crypto');
const { Types } = require('mongoose');


const getInfoData = ({ fields = [], object = {} }) => {
  return pick(object, fields)
}

// [a,b] => {a: 1, b: 1}
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map(el => [el, 1]))
}

// [a,b] => {a: 1, b: 1}
const unSelectData = (select = []) => {
  return Object.fromEntries(select.map(el => [el, 0]))
}

const removeUndefinedObject = (obj) => {
  return omitBy(obj, isNil)
}

const toTypeMongoObjectId = (id) => {
  return new Types.ObjectId(id)
}

/* 
const a = {
  b: 1,
  c: 2
}
=> `a.b` = 1, `a.c` = 2
 */
const updateNestedObjectParse = (obj) => {
  const final = {};
  Object.keys(obj).forEach(k => {
    if (typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
      const response = updateNestedObjectParse(obj[k]);
      Object.keys(response).forEach(a => {
        final[`${k}.${a}`] = response[a]
      })
    } else {
      final[k] = obj[k]
    }
  })
  console.log("final", { final })
  return final;
}

const generateKeyPair = () => {
// create private key, public key
const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'pkcs1', // public key CryptoGraphy Standards
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs1',
      format: 'pem',
    },
  });
  return { privateKey, publicKey }
}

module.exports = {
  getInfoData,
  generateKeyPair,
  getSelectData,
  unSelectData,
  removeUndefinedObject,
  updateNestedObjectParse,
  toTypeMongoObjectId,
}