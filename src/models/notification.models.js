'use strict'

const {model, Schema} = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Notification';
const COLLECTION_NAME = 'Notifications';

// ORDER-001: order successfully created
// ORDER-002: order failed
// PROMOTION-001: new Promotion
// SHOP-001: new Product by User Following


// Declare the Schema of the Mongo model
const notificationSchema = new Schema({
    noti_type:{type: String, enum:['ORDER-001', 'ORDER-002', 'PROMOTION-001', 'SHOP-001'], required: true},
    noti_senderId:{type: Schema.Types.ObjectId, required: true, ref: 'Shop'},
    noti_receiverId:{type: Number, required: true},
    noti_content:{type: String, required: true},
    noti_options:{type: Object, default: {}}
},{
    collection: COLLECTION_NAME,
    timestamps:true
});

//Export the model
module.exports =  {
    NOTI: model(DOCUMENT_NAME, notificationSchema)
}