'use strict';

const { getSelectData, unSelectData } = require('../utils');
const {
  product,
} = require('../models/product.modal');
const { Types } = require('mongoose');

const findAllDraftForShop = async ({ query, limit, skip }) => {
  return await queryProducts({ query, limit, skip });
};

const findAllPublishForShop = async ({ query, limit, skip }) => {
  return await queryProducts({ query, limit, skip });
};

const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });

  if (!foundShop) return null;

  foundShop.isDraft = false;
  foundShop.isPublished = true;
  const { modifiedCount } = await foundShop.updateOne(foundShop);
  return modifiedCount;
};

const unPublishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });

  if (!foundShop) return null;

  foundShop.isDraft = true;
  foundShop.isPublished = false;
  const { modifiedCount } = await foundShop.updateOne(foundShop);
  return modifiedCount;
};

const searchProductByUser = async ({ keyword }) => {
  const regexSearch = new RegExp(keyword);
  const results = await product
    .find(
      {
        isPublished: true,
        $text: { $search: regexSearch },
      },
      { score: { $meta: 'textScore' } }
    )
    .sort({ score: { $meta: 'textScore' } })
    .lean();
  return results;
};

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
  return await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();
};

const findProduct = async ({ product_id }) => {
  return await product
    .findById(new Types.ObjectId(product_id))
    .select(unSelectData(['__v']))
    .lean();
};

const updateProductAttributesById = async ({ productId, payload, model, isNew = true }) => {
  const query = { _id: productId };
  const options = { upsert: true, new: isNew };

  return await model.findOneAndUpdate(query, payload, options)
}

const updateProductById = async ({ productId, payload, model, isNew = true }) => {
  return await model.findByIdAndUpdate(productId, payload, { new: isNew })
}

const queryProducts = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate('product_shop', 'email name -_id')
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

const checkProductByServer = async (products) => {
  return await Promise.all(products.map( async product => {
    const foundProduct = await findProduct(product.productId)
    if (foundProduct) {
      return {
        price: foundProduct.product_price,
        quantity: products.quantity,
        productId: products.productId
      }
    }
  }))

}

module.exports = {
  findAllDraftForShop,
  publishProductByShop,
  findAllPublishForShop,
  unPublishProductByShop,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductAttributesById,
  updateProductById,
  checkProductByServer
};
