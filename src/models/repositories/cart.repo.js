'use strict'

const {convertObjectIdMongodb} = require('../../utils')
const {cartModel} = require('../cart.model.js')

const findCartById = async(cartId)=>{
    return await cartModel.findOne({_id: convertObjectIdMongodb(cartId), cart_state:'active'}).lean();
}

module.exports ={
    findCartById
}