"use strict";

const {
  product,
  electronic,
  furniture,
  clothing,
} = require("../product.modal");
const { Types } = require('mongoose');

const findAllDraftForShop = async ({ query, limit, skip }) => {
  return await queryProducts({ query, limit, skip })
};

const findAllPublishForShop = async ({ query, limit, skip }) => {
  return await queryProducts({ query, limit, skip })
};

const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product
    .findOne({
      product_shop: new Types.ObjectId(product_shop),
      _id: new Types.ObjectId(product_id)
    })

  if (!foundShop) return null

  foundShop.isDraft = false
  foundShop.isPublished = true
  const { modifiedCount } = await foundShop.updateOne(foundShop)
  return modifiedCount
};

const queryProducts = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("product_shop", "email name -_id")
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
}

module.exports = {
  findAllDraftForShop,
  publishProductByShop,
  findAllPublishForShop
};
