'use strict';

const discountModel = require('../models/discount.model');
const { toTypeMongoObjectId } = require('../utils');

const createDiscount = async (payload) => {
  return await discountModel.create(payload)
}

const findOneDiscount = async ({ code, shopId }) => {
  return await discountModel.findOne({
    discount_code: code,
    discount_shop_id: toTypeMongoObjectId(shopId)
  }).lean()
}

module.exports = {
  createDiscount,
  findOneDiscount
}
