'use strict'
const { toTypeMongoObjectId } = require('../utils')
const cartModel = require('../models/cart.model')


const findCartById = async (cartId) => {
    return await cartModel.findOne({ _id: toTypeMongoObjectId(cartId), cart_state: 'active' }).lean()
}

module.exports = {
    findCartById
}
