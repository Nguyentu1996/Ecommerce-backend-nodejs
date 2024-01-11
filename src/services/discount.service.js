'use strict';

const { BadRequestError } = require('../core/error.response');
const { createDiscount, findOneDiscount } = require('../repositories/discount.repo');

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
}

module.exports = new DiscountService()