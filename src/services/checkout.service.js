'use strict'
const { BadRequestError } = require('../core/error.response');
const { findCartById } = require('../repositories/cart.repo');
const { checkProductByServer } = require('../repositories/product.repo');
const { getDiscountAmount } = require('./discount.service');

class CheckoutService {

    /**
     * 
     * @param {*} cartId 
     * @param {*} userId
     * @param {*} shop_order_ids: [
     *  {
     *      shopId,
     *      shop_discounts: [],
     *      item_products: [
     *       {
     *         price,
     *         quantity,
     *         productId
     *       }
     *      ]
     *  },
     *  {
     *      shopId,
     *      shop_discounts: [
     *       {
     *          shopId,
     *          discountId,
     *          codeId
     *       }
     *      ],
     *      item_products: [
     *          {
     *              price,
     *              quantity,
     *              productId
     *          }
     *      ]
     *  }
     * ]
     */
    static async checkoutReview({
        cartId, userId, shop_order_ids
    }) {
        // check cartId is exists
        const foundCart = await findCartById(cartId)
        if (!foundCart) throw new BadRequestError('Cart do not exists')

        const checkout_order = {
            totalPrice: 0,
            feeShip: 0,
            totalDiscount: 0,
            totalCheckout: 0
        }, shop_order_ids_new = []

        // sum total bill
        for (let index = 0; index < shop_order_ids.length; index++) {
            const { shopId, shop_discount = [], item_products = [] } = shop_order_ids[index];
            // check product available
            const checkProductServer = await checkProductByServer(item_products);
            if (!checkProductServer[0]) throw new BadRequestError('order wrong!!!');

            const checkoutPrice = checkProductServer.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)
            
            checkout_order.totalPrice += checkoutPrice

            const itemCheckout = {
                shopId,
                shop_discount,
                priceRaw: checkoutPrice,
                priceApplyDiscount: checkoutPrice,
                item_products: checkProductServer
            }

            if (shop_discount.length > 0) {
                const { totalPrice = 0 , discount = 0 } = await getDiscountAmount({ codeId: shop_discount[0].codeId, userId, products: checkProductServer, shopId});
                checkout_order.totalDiscount += discount;

                if (discount > 0) {
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }
            }

            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
            shop_order_ids_new.push(itemCheckout)
        }

        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }

    static async orderByUser({
        shop_order_ids,
        cartId,
        userId,
        user_address = {},
        user_payment = {}
    }) {
        const { shop_order_ids_new, checkout_order } = CheckoutService.checkoutReview({
            cartId,
            userId,
            shop_order_ids
        })

        const products = shop_order_ids_new.flatMap(order => order.item_products)
    }
}

module.exports = CheckoutService