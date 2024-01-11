'use strict';

const { model, Schema } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'Discounts';

// Declare the Schema of the Mongo model
var disCountSchema = new Schema(
  {
    discount_name: { type: String, required: true },
    discount_description: { type: String, required: true },
    discount_type: {
      type: String,
      require: true,
      enum: ['fix_amount', 'percentage']
      // default: 'fix_amount', // percentage
    },
    discount_value: {
      type: String,
      require: true, // 10.000
    },
    discount_code: {
      type: String,
      require: true,
    },
    discount_start_date: {
      type: Date,
      require: true,
    },
    discount_end_date: {
      type: Date,
      require: true,
    },
    discount_max_uses: {
      // số lượng discount được áp dụng
      type: Number,
      require: true,
    },
    discount_uses_count: {
      // số discount đã sử dụng
      type: Number,
      require: true,
    },
    discount_users_used: {
      // ai đã sử dụng
      type: Array,
      default: [],
    },
    discount_max_use_per_user: {
      // số lượng cho phép tối đa sử dụng
      type: Number,
      require: true,
    },
    discount_min_order_value: {
      type: Number,
      require: true,
    },
    discount_shop_id: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },
    discount_is_active: {
      type: Boolean,
      default: true,
    },
    discount_applies_to: {
      type: String,
      required: true,
      enum: ['all', 'specific'],
    },
    discount_product_ids: {
      type: Array,
      // số sản phẩm được áp dụng
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, disCountSchema);
