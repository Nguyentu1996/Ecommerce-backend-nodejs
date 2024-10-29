'use strict'


const { model, Schema, Types } = require('mongoose'); // Erase if already required
const DOCUMENT_NAME = 'Role'
const COLLECTION_NAME = 'Roles'
const grantList = [
    { role: 'admin', resource: 'profile', action: 'update:any', attributes: '*' },
    { role: 'admin', resource: 'balance', action: 'update:any', attributes: '*, !mount' },
    
    { role: 'user', resource: 'profile', action: 'update:own', attributes: '*' },
    { role: 'user', resource: 'balance', action: 'update:own', attributes: '*, !mount' },

    { role: 'shop', resource: 'profile', action: 'update:any', attributes: '*' },
    { role: 'shop', resource: 'profile', action: 'read:any', attributes: '*' },
]
const roleSchema = new Schema({
    rol_name: { type: String, required: true }, 
    rol_slug: { type: String, required: true },
    rol_description: { type: String, default: '' },
    rol_status: { type: String, default: 'active', enum: ['pending', 'active', 'block'] },
    rol_grants: [
        {
            resource: { type: Schema.Types.ObjectId, ref: 'Resource', required: true },
            actions: [{ type: String, required: true }],
            attributes: { type: String, default: '*' }
        }
    ]
},
{
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, roleSchema);
