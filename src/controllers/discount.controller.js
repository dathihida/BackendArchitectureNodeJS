'use strict'

const DiscountService = require("../services/discount.service.js");
const ProductFactoryV2 = require("../services/product.service.xxx.js");
const { SuccessResponse } = require("../core/success.response.js");

class DiscountController {
    createDiscountCode = async(req, res, next)=> {
        new SuccessResponse({
            message: 'Successfully code Generated',
            metadata: await DiscountService.createDiscountCode({
                ...req.body, 
                shopId: req.user.userId
            })
        }).send(res);
    }

    getAllDiscountCodes = async(req, res, next)=> {
        new SuccessResponse({
            message: 'Successfully get all discount codes',
            metadata: await DiscountService.getAllDiscountCodesByShop({
                ...req.query,
                shopId: req.user.userId
            })
        }).send(res);
    }

    getDiscountAmount= async(req, res, next)=> {
        new SuccessResponse({
            message: 'Successfully get discount amount',
            metadata: await DiscountService.getDiscountAmount({
                ...req.body
            })
        }).send(res);
    }

    getAllDiscountCodesWithProducts = async(req, res, next)=> {
        new SuccessResponse({
            message: 'Successfully get all discount codes with products',
            metadata: await DiscountService.getAllDiscountCodesWithProduct({
                ...req.query
            })
        }).send(res);
    }
}

module.exports = new DiscountController();