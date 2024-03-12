'use strict';

const { BadRequestError, NotFoundError } = require('../core/error.response');
const { createDiscount, findOneDiscount, findAllDiscountCodesUnSelect, checkDiscountExists } = require('../repositories/discount.repo');
const { findAllProducts } = require('../repositories/product.repo');
const discountModel = require('../models/discount.model');

class Discount {
  constructor(builder) {
    // defined props with builder
    this.discount_name = builder.name,
    this.discount_description = builder.description,
    this.discount_type = builder.type,
    this.discount_value = builder.value,
    this.discount_code = builder.code,
    this.discount_start_date = builder.start_date,
    this.discount_end_date = builder.end_date,
    this.discount_max_uses = builder.max_uses,
    this.discount_uses_count = builder.uses_count,
    this.discount_users_used = builder.users_used,
    this.discount_max_use_per_user = builder.max_uses_per_use,
    this.discount_min_order_value = builder.min_order_value,
    this.discount_shop_id = builder.shopId,
    this.discount_is_active = builder.is_active,
    this.discount_applies_to = builder.applies_to,
    this.discount_product_ids = builder.product_ids
  }

  async create() {
    return await createDiscount(this)
  }
}

class DiscountBuilder {
  constructor() {
  // defined props
    this.code = '',
    this.start_date = new Date(),
    this.end_date = new Date(),
    this.is_active = false,
    this.shopId = '',
    this.min_order_value = 0,
    this.product_ids = [],
    this.applies_to = 'all',
    this.name = '',
    this.description = '',
    this.type = 'fix_amount',
    this.value = '',
    this.max_value = '',
    this.max_uses = 0,
    this.uses_count = 0,
    this.max_uses_per_use = 0
  }

  withCode(code) {
    this.code = code
    return this
  }

  withStartDate(startDate) {
    this.start_date = new Date(startDate)
    return this
  }

  withEndDate(endDate) {
    this.start_date = new Date(endDate)
    return this
  }

  withShop(shopId) {
    this.shopId = shopId
    return this
  }

  withMinOrderValue(minOrderValue) {
    this.min_order_value = minOrderValue ?? 0
    return this
  }

  withProductIds(productIds) {
    this.product_ids = this.applies_to ? [] : productIds
    return this
  }

  withName(name) {
    this.name = name
    return this
  }

  withDescription(description) {
    this.description = description
    return this
  }

  withValue(value) {
    this.value = value
    return this
  }

  withMaxValue(maxValue) {
    this.max_value = maxValue
    return this
  }

  withActive(isActive) {
    this.is_active = isActive
    return this
  }

  withType(type) {
    this.type = type
    return this
  }

  withMaxUses(maxUses) {
    this.max_uses = maxUses
    return this
  }

  withUserCount(usesCount) {
    this.uses_count = usesCount
    return this
  }

  withMaxUserPerUse(maxUserPerUse) {
    this.max_uses_per_use = maxUserPerUse
    return this
  }

  withAppliesTo(appliesTo) {
    this.applies_to = appliesTo
    return this
  }

  isExpired() {
    return new Date() > new Date(this.start_date) || new Date() > new Date(this.end_date)
  }

  build() {
    return new Discount(this)
  }
}

/**
 *  Discount service
 * 1. generate discount code [Shop | Admin]
 * 2. get discount amount [User]
 * 3. get all discount codes [User | Shop]
 * 4. verify discount codes [User]
 * 5. delete discount code [Admin | Shop]
 * 6. cancel discount code [user]
 */

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      uses_count,
      max_uses_per_use
    } = payload;

    const foundDiscount = await findOneDiscount({ code, shopId })
    if (foundDiscount && foundDiscount.discount_is_active) {
      throw BadRequestError('Discount exists!')
    }

    const builderDiscount = new DiscountBuilder();
    const newDiscount = builderDiscount
      .withCode(code)
      .withStartDate(start_date)
      .withEndDate(end_date)
      .withDescription(description)
      .withName(name)
      .withMinOrder(min_order_value)
      .withValue(value)
      .withShop(shopId)
      .withActive(is_active)
      .withAppliesTo(applies_to)
      .withProductIds(product_ids)
      .withType(type)
      .withMaxValue(max_value)
      .withMinOrderValue(min_order_value)
      .withMaxUses(max_uses)
      .withUserCount(uses_count)
      .withMaxUserPerUse(max_uses_per_use)
      .build()

    return await newDiscount.create()
  }
  static async updateDiscountCode() {

  }

  /**
   * get all discount codes available with products
   */
  static async getAllDiscountCodesWithProduct({ code, shopId, limit, page }) {
    const foundDiscount = await findOneDiscount({ code, shopId })
    if (!foundDiscount || foundDiscount.discount_is_active) {
      throw new NotFoundError('discount not exists!')
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount
    let products = []
    if (discount_applies_to === 'all') {
      // get all product
      products = await findAllProducts({
        filter: {
          product_shop: toTypeMongoObjectId(shopId),
          isPublished: true
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name']
      })
    }

    if (discount_applies_to === 'specific') {
       // get all product
      products = await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name']
      })
    }
    return products;
  }

  /**
   * get all discount codes of shop
   */
  static async getAllDiscountCodesByShop({
    limit, page, shopId
  }) {
    const discounts = await findAllDiscountCodesUnSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shop_id: toTypeMongoObjectId(shopId),
        discount_is_active: true
      },
      unSelect: ['__v', 'discount_shop_id'],
    })
    return discounts;
  }

  /**
   * Apply Discount Code
   * products = [
   *  {
   *    productId,
   *    shopId,
   *    quantity,
   *    name,
   *    price,
   *  },
   *  ...
   * ]
   */

  static async getDiscountAmount({ codeId, userId, shopId, products }) {
    const foundDiscount = await checkDiscountExists({
      filter: {
        discount_code: codeId,
        discount_shop_id: toTypeMongoObjectId(shopId)
      }
    })

    if (!foundDiscount) throw new NotFoundError(`discount doesn't exists`)

    const {
      discount_is_active,
      discount_max_uses,
      discount_start_date,
      discount_end_date,
      discount_min_order_value,
      discount_users_used,
      discount_max_use_per_user,
      discount_type,
      discount_value
    } = foundDiscount

    if (!discount_is_active) throw new NotFoundError(`discount expired`)

    if (!discount_max_uses) throw new NotFoundError(`discount are out!`)
    
    const builderDiscount = new DiscountBuilder();
    const newDiscount = builderDiscount
      .withStartDate(discount_start_date)
      .withEndDate(discount_end_date)
    
    if (newDiscount.isExpired()) {
      throw new NotFoundError(`discount expired`)
    }

    let totalOrder = 0
    // check min orders value
    if (discount_min_order_value > 0) {
      // get total
      totalOrder = products?.reduce((acc, product) => {
        return acc + (product.quantity + product.price)
      })

      if (totalOrder < discount_min_order_value) {
        throw new NotFoundError(`discount requires a minium order value of ${discount_min_order_value}`)
      }
    }

    if (discount_max_use_per_user > 0) {
      const userUsedDiscount = discount_users_used.find(user => user.userId === userId)
      if (userUsedDiscount) {
        throw new NotFoundError(`discount has been used`)
      }
    }

    const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount
    }

  }

  static async deleteDiscountCode({ shopId, codeId }) {
    const deleted = await discountModel.findOneAndDelete({
      discount_code: codeId,
      discount_shop_id: toTypeMongoObjectId(shopId)
    })
    return deleted
  }

  static async cancelDiscountCode({ codeId, shopId, userId }) {
    const foundDiscount = await checkDiscountExists({
      filter: {
        discount_code: codeId,
        discount_shop_id: toTypeMongoObjectId(shopId)
      }
    })

    if (!foundDiscount) throw new NotFoundError(`discount doesn't exists`)

    const result = await discountModel.findByIdAndUpdate(foundDiscount?._id, {
      $pull: {
        discount_users_used: userId
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1
      }
    })
    return result
  }
}

module.exports = DiscountService;
