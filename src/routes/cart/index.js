"use strict";

const express = require("express");
const routes = express.Router();
const { asyncHandle } = require("../../helpers/asyncHandle");
const cartController = require("../../controllers/cart.controller");

routes.post('', asyncHandle(cartController.addToCart))
routes.delete('', asyncHandle(cartController.delete))
routes.post('update', asyncHandle(cartController.update))
routes.get('', asyncHandle(cartController.listToCart))

module.exports = routes