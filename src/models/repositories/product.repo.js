'use strict';

const {product, electronic, clothing, furniture} = require('../../models/product.model.js');
const {Types} = require('mongoose')

const findAllDraftProducts = async ({query, limit, skip}) => { 
    return await queryProduct({query, limit, skip});
}

const findAllPublishProducts = async ({query, limit, skip}) => { 
    return await queryProduct({query, limit, skip});
}

const publishProductByShop = async ({product_id, product_shop}) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    });
    if(!foundShop) return null;

    foundShop.isDraft = false;
    foundShop.isPublished = true;
    const {modifiedCount} = await foundShop.updateOne(foundShop)
    return modifiedCount;
}

const unPublishProductByShop = async ({product_id, product_shop}) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    });
    if(!foundShop) return null;

    foundShop.isDraft = true;
    foundShop.isPublished = false;
    const {modifiedCount} = await foundShop.updateOne(foundShop)
    return modifiedCount;
}

const queryProduct = async ({query, limit, skip}) => {
    return await product.find(query)
        .populate('product_shop', 'name email -_id')
        .sort({updatedAt: -1})
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}

module.exports = {
    findAllDraftProducts,
    publishProductByShop,
    findAllPublishProducts,
    unPublishProductByShop
}
