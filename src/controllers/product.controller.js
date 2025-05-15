'use strict';

const {ProductFactory} = require("../services/product.service.js");
const ProductFactoryV2 = require("../services/product.service.xxx.js");
const { SuccessResponse } = require("../core/success.response.js");

class ProductController {
    createProduct = async(req, res, next) => {
        // level 00
        // new SuccessResponse({
        //     message: 'Create new product success!',
        //     metadata: await ProductFactory.createProduct(req.body.product_type, {
        //         ...req.body,
        //         product_shop: req.user.userId,
        //     })
        // }).send(res);

        // level 01
        new SuccessResponse({
            message: 'Create new product success!',
            metadata: await ProductFactoryV2.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId,
            })
        }).send(res);
    }
}

module.exports = new ProductController();
