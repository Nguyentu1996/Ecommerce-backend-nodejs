
'use strict';
const { AuthFailureError } = require('../core/error.response');
const { roleList } = require('../services/rabc.service');
const rbac = require('./role.middleware');

const grantAccess = (action, resource) => {
    return async (req, res, next) => {
        try {
            rbac.setGrants(await roleList({
                userId: req.user.userId,
            }));
            const rol_name = req.user.role || 'admin';
            const permission = rbac.can(rol_name)[action](resource);
            if (!permission.granted) {
                throw new AuthFailureError(`you don't have permissions...`)
            }

            next()
        } catch(error) {
            next(error)
        }
    }
}

module.exports = {
    grantAccess
}