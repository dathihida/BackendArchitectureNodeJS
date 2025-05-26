'use strict';

const {model, Schema, Types} = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'Discounts';

// Declare the Schema of the Mongo model
const discountSchema = new Schema({
    discount_name: {type: String, required: true},
    discount_description: {type: String, required: true},
    discount_type: {
        type: String,
        default: 'fixed_amount', // 'percentage' or 'fixed'
    },
    discount_value: {
        type: Number, // 10.000 , 10% or 100.000
        required: true
    },
    discount_code: {
        type: String,
        required: true
    },
    discount_start_date: {
        type: Date,
        required: true
    },
    discount_end_date: {
        type: Date,
        required: true
    },
    discount_max_uses: {
        type: Number, // the number if uses for this discount
        required: true
    },
    discount_uses_count:{type: Number, required: true}, // the number of this discount has been use
    discount_users_used:{type: Array, default: []}, // array of user who have used this discount
    discount_max_uses_per_user: {
        type: Number, // the number of uses for this discount per user
        required: true
    },
    discount_min_order_value: {
        type: Number, // minimum order value to apply this discount
        required: true
    },
    discount_shopId:{type: Schema.Types.ObjectId, ref: 'Shop'}, // the shop that this discount belongs to
    discount_is_active: {
        type: Boolean,
        default: true // whether the discount is active or not
    },
    discount_applies_to: {
        type: String,
        required: true,
        enum: ['all', 'specific']
    },
    discount_product_ids: {
        type: Array, //product of this discount applies to
        default: []
    },
},{
    timestamps:true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, discountSchema);