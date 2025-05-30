'use strict'

const { SuccessResponse } = require("../core/success.response");
const { createRole, createResource, roleList, resourceList } = require("../services/rabc.service");

/**
 * @des Create a new role
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const newRole = async (req, res, next) => {
    new SuccessResponse({
        message: 'create role',
        metadata: await createRole(req.body)
    }).send(res)
}


const newResource = async (req, res, next) => {
    new SuccessResponse({
        message: 'create resource',
        metadata: await createResource(req.body)
    }).send(res)
}


const listResource = async (req, res, next) => {
    new SuccessResponse({
        message: 'create resource',
        metadata: await resourceList(req.query)
    }).send(res)
}


const listRole = async (req, res, next) => {
    new SuccessResponse({
        message: 'create resource',
        metadata: await roleList(req.query)
    }).send(res)
}


module.exports = {
    newRole,
    newResource,
    listRole,
    listResource,
}
