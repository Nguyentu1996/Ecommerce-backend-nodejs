'use strict';

const crypto = require('crypto');
const apiKeyModel = require('../models/apiKey.model');

const findById = async (key) => {
  return await apiKeyModel.findOne({ key, status: true }).lean();
};

const createApiKey = async () => {
  return await apiKeyModel.create({ key: crypto.randomBytes(64).toString('hex'), status: true, permissions: ['0000'] })
};

module.exports = {
  findById,
  createApiKey,
};
