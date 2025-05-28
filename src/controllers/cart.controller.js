'use strict'

const DiscountService = require("../services/discount.service.js");
const ProductFactoryV2 = require("../services/product.service.xxx.js");
const CartService = require("../services/cart.service.js");
const { SuccessResponse } = require("../core/success.response.js");

class CartController {
    /**
     * @desc add to cart for user
     * @param {int} userId
     * @param {*} res
     * @param {*} next
     * @method POST
     * @url /v1/api/cart/user
     * @return {
     * }
    */
    addToCart = async(req, res, next)=>{
        // new
        new SuccessResponse({
            message: 'Create new Cart success',
            metadata: await CartService.addToCart(req.body)
        }).send(res)
    }

    // update + -
    updateToCart = async(req, res, next)=>{
        // new
        new SuccessResponse({
            message: 'Update new Cart success',
            metadata: await CartService.addToCartV2(req.body)
        }).send(res)
    }

    //delete
    delete = async(req, res, next)=>{
        // new
        new SuccessResponse({
            message: 'Delete Cart success',
            metadata: await CartService.deleteUserCart(req.body)
        }).send(res)
    }

    // list
    listToCart = async(req, res, next)=>{
        // new
        new SuccessResponse({
            message: 'List Cart success',
            metadata: await CartService.getListUserCart(req.query)
        }).send(res)
    }
}
module.exports = new CartController();