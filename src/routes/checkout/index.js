"use strict";

const express = require("express");
const routes = express.Router();
const { asyncHandle } = require("../../helpers/asyncHandle");
const checkoutController = require("../../controllers/checkout.controller");

routes.post('/review', asyncHandle(checkoutController.checkoutReview))

module.exports = routes