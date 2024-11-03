"use strict";

const express = require("express");
const routes = express.Router();
const { asyncHandle } = require("../../helpers/asyncHandle");
const { grantAccess } = require("../../middlewares/role.middleware");
const profileController = require("../../controllers/profile.controller");
const { authentication } = require("../../auth/authUtils");

routes.get('/view', authentication, grantAccess('readAny', 'profile'), asyncHandle(profileController.viewProfile))

module.exports = routes