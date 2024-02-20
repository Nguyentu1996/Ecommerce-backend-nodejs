'use strict'

const Joi = require("joi");

const createDiscountSchema = Joi.object({
  code: Joi.string().required(),
  start_date: Joi.date().greater('now').required(),
  end_date: Joi.date().greater(Joi.ref('start_date')).required(),
  is_active: Joi.boolean(),
  min_order_value: Joi.number().required(),
  product_ids: Joi.array(),
  applies_to: Joi.string().valid('all', 'specific'),
  name: Joi.string().required(),
  description: Joi.string(),
  type: Joi.string().valid('fix_amount', 'percentage').required(),
  value: Joi.number().required(),
  max_value: Joi.number().required(),
  max_uses: Joi.number().required(),
  uses_count: Joi.number().required(),
  max_uses_per_use: Joi.number().required()
});

module.exports = createDiscountSchema;

