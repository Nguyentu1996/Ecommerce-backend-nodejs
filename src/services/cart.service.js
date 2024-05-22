'use strict'

const { NotFoundError } = require('../core/error.response');
const { cart } = require('../models/cart.model');
const { findProduct } = require('../repositories/product.repo');

class CartService { 

    static async createUserCart({ userId, product }) {
        const query = { cart_userId: userId, cart_state: 'active' },
        updateOrInsert = { 
            $addToSet: {
                cart_products: product
            }
        },
        options = { upsert: true, new: true }
        return await cart.findOneAndUpdate(query, updateOrInsert, options)
    }

    static async updateUserCartQuantity({ userId, product }) {
        const { productId, quantity } = product;
        const query = {
            cart_userId: userId,
            'cart_products.productId': productId,
            cart_state: 'active'
        }, updateSet = {
            $inc: {
                'cart_products.$.quantity': quantity
            }
        }, options = { upsert: true, new: true }
        return await cart.findOneAndUpdate(query, updateSet, options)
    }

    static async addToCart({ userId, product = {} }) {
        const userCart = await cart.findOne({ cart_userId: userId })
        if (!userCart) {
            // create new cart for user
            return await CartService.createUserCart({ userId, product })
        }

        if (!userCart.cart_products.length) {
            userCart.cart_products = [product]
            return await userCart.save()
        }

        return await CartService.updateUserCartQuantity({ userId, product })
    }

    /**
     * 
     * @param {Array} shop_order_ids: [
     *      shopId,
     *      item_products: [
     *        {
     *          quantity,
     *          price,
     *          shopId,
     *          old_quantity,
     *          productId
     *        }
     *      ]
     * ] 
     */
    static async addToCartV2({ userId, product = {} }) {
        const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_products[0]
        // check product
        const foundProduct = await findProduct({ product_id: productId })
        if (!foundProduct) throw new NotFoundError('')
        // compare
        if (foundProduct.product_shop.toString() !== shop_order_ids[0].shopId) throw new NotFoundError('Product do not belong to the shop')

        if (quantity === 0) {
            // delete
        }

        return await CartService.updateUserCartQuantity({
            userId,
            product: {
                productId,
                quantity: quantity - old_quantity
            }
        })
    }

    static async deleteUserCart({ userId, productId }) {
        const query = { cart_userId: userId, cart_state: 'active' },
        updateSet = {
            $pull: {
                cart_products: {
                    productId
                }
            }
        }

        const deleteCart = await cart.updateOne(query, updateSet)
        return deleteCart
    }

    static async getListUserCart({ userId }) {
        return await cart.findOne({
            cart_userId: +userId
        }).lean()
    }
}

module.exports = CartService;