'use strict'
const ProductService = require('../services/product.service');
const { CREATED, SuccessResponse } = require('../core/success.response')

class ProductController {
  createProduct = async (req, res, next) => {
    new CREATED({
      message: 'Create New Products Success',
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId
      })
    }).send(res)
  }

  /**
   * @des Publish Product by shop
   * @param {Number} product_id 
   * @param {Number} product_shop 
   * @return {JSON}
   */
  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Publish Product Success',
      metadata: await ProductService.publishProductByShop( {
        product_id: req.params.id,
        product_shop: req.user.userId
      })
    }).send(res)
  }

  /**
   * @des unPublish Product by shop
   * @param {Number} product_id 
   * @param {Number} product_shop 
   * @return {JSON}
   */
    unPublishProductByShop = async (req, res, next) => {
      new SuccessResponse({
        message: 'unPublish Product Success',
        metadata: await ProductService.unPublishProductByShop( {
          product_id: req.params.id,
          product_shop: req.user.userId
        })
      }).send(res)
    }

  /**
   * @des Get all Drafts products for shop
   * @param {Number} limit 
   * @param {Number} skip 
   * @return {JSON}
   */
  getAllDraftForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get List Draft Success',
      metadata: await ProductService.findAllDraftForShop({
        product_shop: req.user.userId
      })
    }).send(res)
  }

  /**
   * @des Get all publish products for shop
   * @param {Number} limit 
   * @param {Number} skip 
   * @return {JSON}
   */
  getAllPublishForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get List publish products Success',
      metadata: await ProductService.findAllPublishForShop({
        product_shop: req.user.userId
      })
    }).send(res)
  }

  /**
   * @des Get list search products publish by user
   * @param {String} keyword 
   * @return {JSON}
   */
  getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get List search publish products Success',
      metadata: await ProductService.searchProductByUser({
        keyword: req.params.keyword
      })
    }).send(res)
  }
}

module.exports = new ProductController();
