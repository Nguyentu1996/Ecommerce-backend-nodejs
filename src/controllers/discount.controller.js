"use strict";

const DiscountService = require("../services/discount.service");

class DiscountController {
  createDiscount = async (req, res, next) => {
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
  
  // cancelDiscount = async (req, res, next) => {
  //   new CREATED({
  //     message: "Cancel discount Success",
  //     metadata: await DiscountService.cancelDiscountCode({
  //       ...req.body,
  //       shopId: req.user.userId,
  //     }),
  //   }).send(res);
  // };

}

module.exports = new DiscountController();
