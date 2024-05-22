"use strict";

const express = require("express");
const routes = express.Router();
const { asyncHandle } = require("../../helpers/asyncHandle");
const { authentication } = require("../../auth/authUtils");
const discountController = require("../../controllers/discount.controller");
const { createDisCountSchema } = require("../../validators/discount");
const { validatorHandle } = require("../../helpers/validatorHandle");

routes.post("/amount", asyncHandle(discountController.getDiscountAmount));

routes.get(
  "/list_product_code",
  asyncHandle(discountController.getDiscountCodesWithProducts)
);

// authentication
routes.use(authentication);

routes.post(
  "",
  validatorHandle(createDisCountSchema),
  asyncHandle(discountController.createDiscountCode)
);

routes.get("", asyncHandle(discountController.getAllDiscountCode));

module.exports = routes;
