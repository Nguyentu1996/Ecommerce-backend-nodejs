'use strict';

const discountModel = require('../models/discount.model');
const { toTypeMongoObjectId, unSelectData, getSelectData } = require('../utils');

const createDiscount = async (payload) => {
  return await discountModel.create(payload)
}

const findOneDiscount = async ({ code, shopId }) => {
  return await discountModel.findOne({
    discount_code: code,
    discount_shop_id: toTypeMongoObjectId(shopId)
  }).lean()
}

const findAllDiscountCodesUnSelect = async({
  limit = 50, page = 1, sort = 'ctime',
  filter, unSelect
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
  const results = await discountModel.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unSelectData(unSelect))
    .lean()
  return results
}

const findAllDiscountCodesSelect = async({
  limit = 50, page = 1, sort = 'ctime',
  filter, select
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
  const results = await discountModel.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()
  return results
}

const checkDiscountExists = async (filter) => {
  return await discountModel.findOne(filter).lean()
}

module.exports = {
  createDiscount,
  findOneDiscount,
  findAllDiscountCodesUnSelect,
  findAllDiscountCodesSelect,
  checkDiscountExists
}
