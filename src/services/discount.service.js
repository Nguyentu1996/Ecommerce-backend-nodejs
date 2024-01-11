'use strict';

const { createDiscount } = require('../repositories/discount.repo');

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
    this.start_date = startDate
    return this
  }

  withEndDate(startDate) {
    this.start_date = startDate
    return this
  }

  withShop(shopId) {
    this.shopId = shopId
    return this
  }

  withMinOrder(minOrderValue) {
    this.min_order_value = minOrderValue
    return this
  }

  withProductIds(productIds) {
    this.product_ids = productIds
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

    
  }
}

module.exports = new DiscountService()