"use strict";

const express = require("express");
const routes = express.Router();
const { asyncHandle } = require("../../helpers/asyncHandle");
const {
    listRole,
    listResource,
    newRole,
    newResource,
} = require("../../controllers/rabc.controller")


routes.get('/roles', asyncHandle(listRole))
routes.get('/resources', asyncHandle(listResource))

routes.post('/role', asyncHandle(newRole))
routes.post('/resource', asyncHandle(newResource))

module.exports = routes