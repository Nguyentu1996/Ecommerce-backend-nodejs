'use strict'

//!dmbg
const { model, Schema, Types } = require('mongoose'); // Erase if already required
const DOCUMENT_NAME = 'Shop'
const COLLECTION_NAME = 'Shops'

// Declare the Schema of the Mongo model
var shopSchema = new Schema({
    name:{
        type:String,
        trim:true,
        maxLength: 150
    },
    email:{
        type:String,
        trim:true,
        unique:true,
    },
    status:{
        type:String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    },
    password:{
        type:String,
        required:true,
    },
    verify: {
      type: Schema.Types.Boolean,
      default: false
    },
    roles: [{ type: Schema.Types.ObjectId, required: true }]
}, {
  timestamps: true,
  collection: COLLECTION_NAME
});

//Export the model 
module.exports = model(DOCUMENT_NAME, shopSchema);