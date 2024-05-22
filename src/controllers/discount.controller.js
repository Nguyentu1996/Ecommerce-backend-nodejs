"use strict";

const { SuccessResponse, CREATED } = require("../core/success.response");
const DiscountService = require("../services/discount.service");

class DiscountController {
  createDiscountCode = async (req, res, next) => {
    new CREATED({
      message: "Create New Discount Success",
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  getAllDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: 'successful code found',
      metadata: await DiscountService.getAllDiscountCodesByShop({
        ...req.query,
        shopId: req.user.userId
      })
    })
  }

  getDiscountAmount = async (req, res, next) => {
    new SuccessResponse({
      message: 'successful code found',
      metadata: await DiscountService.getDiscountAmount({
        ...req.body,
      })
    })
  }

  getDiscountCodesWithProducts = async (req, res, next) => {
    new SuccessResponse({
      message: 'successful code found',
      metadata: await DiscountService.getAllDiscountCodesWithProduct({
        ...req.query
      })
    })
  }
  
  cancelDiscount = async (req, res, next) => {
    new SuccessResponse({
      message: "Cancel discount Success",
      metadata: await DiscountService.cancelDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

}

module.exports = new DiscountController();
