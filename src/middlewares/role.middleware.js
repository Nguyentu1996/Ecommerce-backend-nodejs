'use strict';

const { AuthFailureError } = require('../core/error.response')
const rbac = require('../auth/rbac');
const { roleList } = require('../services/rabc.service')
const { getListCache, setListCache } = require('../services/redis.service');

const grantAccess = (action, resource) => {
    return async (req, res, next) => {
        try {
            let roles = await getListCache('ROLES');
            if (!roles.length) {
                roles = await roleList({
                    userId: 0,
                });
                await setListCache('ROLES', roles);
            }

            rbac.setGrants(roles);
            const rol_name = req.user.role;
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