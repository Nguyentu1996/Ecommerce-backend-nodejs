'use strict';
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
