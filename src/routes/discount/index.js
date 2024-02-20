"use strict";
const express = require("express");
const routes = express.Router();
const { asyncHandle } = require("../../helpers/asyncHandle");
const { authentication } = require("../../auth/authUtils");
const discountController = require("../../controllers/discount.controller");
const { createDisCountSchema } = require("../../validators/discount");
const { validatorHandle } = require("../../helpers/validatorHandle");

// authentication
routes.use(authentication);

routes.post(
  "",
  validatorHandle(createDisCountSchema),
  asyncHandle(discountController.createDiscount)
);

module.exports = routes;
