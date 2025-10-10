'use strict';

const { orderBy } = require('lodash');
const {model, Schema} = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Order';
const COLLECTION_NAME = 'Orders';

// Declare the Schema of the Mongo model
const orderSchema = new Schema({
    order_userId:{type: Number, required: true},
    order_checkout:{type: Object, default: {}},
    /**
        order_checkout = {
            totalPrice: 0, // tong tien hang
            feeShip: 0, // phi van chuyen
            totalDiscount: 0, // tong tien discount giam gia
            totalApplyDiscount: 0, // tong tien discount ap dung
        }
    */
    order_shipping:{type: Object, default: {}},
    /**
     * street,
     * city,
     * state,
     * country
     */
    order_payment:{type: Object, default: {}},
    order_products:{type: Array, required: true},
    order_trackingNumber:{type: String, default: '#00000010102025'},
    order_status:{type: String, enum: ['pending', 'confirmed', 'shipping', 'delivered', 'canceled'], default: 'pending'},
},{
    collection: COLLECTION_NAME,
    timestamps:{
        createdAt: 'createdOn',
        updatedAt: 'modifiedOn'
    }
});

//Export the model
module.exports = { 
    orderModel: model(DOCUMENT_NAME, orderSchema)
}