'use strict';
const Resource = require('../models/resource.model'); 
const Role = require('../models/role.model'); 

const createResource = async ({
    name = 'profile',
    slug = 'p0001',
    description = ''
}) => {
    try {
        // 1 check name or slug exists

        // 2 new resource

        const resource = await Resource.create({
            src_name: name,
            src_slug: slug,
            src_description: description
        })

        return resource;

    } catch (err) {
        return err
    }

}

const createRole = async ({
    name = 'shop',
    slug = 's0001',
    description = '',
    grants = []
}) => {
    // 1 check role exists


    // 2 create role

    try {
        const role = await Role.create({
            rol_name: name,
            rol_description: description,
            rol_slug: slug,
            rol_grants: grants
        })
        return role

    } catch (err) {
        return err
    }

}

const getRoleByName = async ({
    rol_name
}) => {
    return await Role.findOne({ rol_name }).lean().exec();
}

const roleList = async ({
    userId = 0, //admin
    limit = 30,
    offset,
    search = ''
}
) => {
    try {
        const resource = await Role.aggregate([
            {
                $unwind: '$rol_grants'
            },
            {
                $lookup: {
                    from: 'Resources',
                    localField: 'rol_grants.resource',
                    foreignField: '_id',
                    as: 'resource'
                }
            },
            {
                $unwind: '$resource'
            },
            {
                $project: {
                    _id: 0,
                    role: '$rol_name',
                    resource: '$resource.src_name',
                    roleId: '$_id',
                    actions: '$rol_grants.actions',
                    attributes: '$rol_grants.attributes',
                }
            },
            {
                $unwind: '$actions'
            },
            {
                $project: {
                    role: 1,
                    resource: 1,
                    attributes: 1,
                    action: '$actions',
                }
            }
        ]);

        return resource;

    } catch (err) {
        return [];
    }

}

const resourceList = async ({
    userId = 0, //admin
    limit = 30,
    offset,
    search = ''
}) => {
    try {
        const resource = await Resource.aggregate([
            {
                $project: {
                    _id: 0,
                    name: '$src_name',
                    slug: '$src_slug',
                    description: '$src_description',
                    resourceId: '$_id',
                    createAt: 1
                }
            }
        ]);

        return resource;

    } catch (err) {
        return [];
    }
}

module.exports = {
    createResource,
    createRole,
    roleList,
    resourceList,
    getRoleByName
}
