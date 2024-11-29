'use strict'

const { Schema, model } = require('mongoose');
const { default: slugify } = require('slugify');

const DOCUMENT_NAME = 'Spu';
const COLLECTION_NAME = 'Spus';

const spuSchema = new Schema({
  product_id: { type: String, required: true },
  product_name: { type: String, required: true },
  product_thumb: { type: String, required: true },
  product_description: { type: String },
  product_slug: { type: String },
//   product_price: { type: Number, required: true },
  product_category: { type: Array, required: true },
  product_quantity: { type: Number, required: [] },
  product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
  product_attributes: { type: Schema.Types.Mixed, required: true },
  /**
   * {
   *  attribute_id: 1234 // style ao [han quoc, thoi trang, mua he]
   *  attribute_value: [
   *    value_id: 123
   *  ]
   * }
   */
  // more
  product_ratingsAverage: {
    type: Number,
    default: 4,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be above 5.0'],
    set: (val) => Math.round(val * 10) / 10
  },
  product_variations : { type: [], default: [] },
  /**
   *  tier_variations: [
   *    {
   *        images: [],
   *        name: 'Color',
   *        options: ['red', 'green'],
   *    },
   *    {
   *        name: 'size',
   *        options: ['S', 'M'],
   *        images: []
   *    }
   *  ]
   */
  isDraft: { type: Boolean, default: true, index: true, select: false },
  isPublished: { type: Boolean, default: false, index: true, select: false },
  isDeleted: { type: Boolean, default: false }
}, {
  collection: COLLECTION_NAME,
  timestamps: true
})

// create index for search
spuSchema.index({ product_name: 'text', product_description: 'text'})

// product middleware: runs before .save() and .create()
spuSchema.pre('save', function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next()
})

module.exports = model(DOCUMENT_NAME, spuSchema)
