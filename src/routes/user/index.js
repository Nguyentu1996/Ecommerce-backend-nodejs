"use strict";

const express = require("express");
const routes = express.Router();
const { asyncHandle } = require("../../helpers/asyncHandle");
const { grantAccess } = require("../../middlewares/role.middleware");
const userController = require("../../controllers/user.controller");
// const { authentication } = require("../../auth/authUtils");

routes.get('/verify', asyncHandle(userController.verifyEmailToken))
routes.post('/create', asyncHandle(userController.newUser))

module.exports = routes