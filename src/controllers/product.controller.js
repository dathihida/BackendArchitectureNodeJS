'use strict';

const {ProductFactory} = require("../services/product.service.js");
const ProductFactoryV2 = require("../services/product.service.xxx.js");
const { SuccessResponse } = require("../core/success.response.js");
const { get } = require("lodash");

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

    publishProductByShop = async(req, res, next) => {
        new SuccessResponse({
            message: 'Create publish product success!',
            metadata: await ProductFactoryV2.publishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId,
            })
        }).send(res);  
    }

    unPublishProductByShop = async(req, res, next) => {
        new SuccessResponse({
            message: 'Create unpublish product success!',
            metadata: await ProductFactoryV2.unPublishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId,
            })
        }).send(res);  
    }

    //Query
    /**
     * @desc Get all Draft for shop
     * @param {Number} limit 
     * @param {Number} kip 
     * return {JSON}
     */
    getAllDraftsForShop = async(req, res, next) => {
        new SuccessResponse({
        message: 'Get all list draft success!',
        metadata: await ProductFactoryV2.findAllDraftProducts({
            product_shop: req.user.userId,})
        }).send(res);
    }
    //End query

    getAllPublishForShop = async(req, res, next) => {
        new SuccessResponse({
        message: 'Get all list publish success!',
        metadata: await ProductFactoryV2.findAllPublishProducts({
            product_shop: req.user.userId,})
        }).send(res);
    }

    getListSearchProducts = async(req, res, next) => {
        new SuccessResponse({
            message: 'Get list search products success!',
            metadata: await ProductFactoryV2.searchProducts(req.params)
        }).send(res);
    }

    findAllProducts = async(req, res, next) => {
        new SuccessResponse({
            message: 'Get list all products success!',
            metadata: await ProductFactoryV2.findAllProducts(req.query)
        }).send(res);
    }

    findProducts = async(req, res, next) => {
        new SuccessResponse({
            message: 'Get list find one products success!',
            metadata: await ProductFactoryV2.findProducts({
                product_id: req.params.product_id
            })
        }).send(res);
    }
}

module.exports = new ProductController();
