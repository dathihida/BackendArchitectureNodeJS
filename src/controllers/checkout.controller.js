'use strict'

const DiscountService = require("../services/discount.service.js");
const ProductFactoryV2 = require("../services/product.service.xxx.js");
const CheckoutService = require("../services/checkout.service.js");
const { SuccessResponse } = require("../core/success.response.js");

class CheckoutController {
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
    checkoutReview = async(req, res, next)=>{
        // new
        new SuccessResponse({
            message: 'Checkout Review Order',
            metadata: await CheckoutService.checkoutReview(req.body)
        }).send(res)
    }
}
module.exports = new CheckoutController();