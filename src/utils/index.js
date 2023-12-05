'use strict'

const { pick } = require('lodash')
const crypto = require('crypto');

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
  unSelectData
}