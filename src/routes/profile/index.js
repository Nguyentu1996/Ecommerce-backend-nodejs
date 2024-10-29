"use strict";

const express = require("express");
const routes = express.Router();
const { asyncHandle } = require("../../helpers/asyncHandle");
const profileController = require("../../controllers/profile.controller");
const { grantAccess } = require("../../middlewares/rbac");


routes.get('/view', grantAccess('readAny', 'profile'), profileController.viewProfile)

module.exports = routes