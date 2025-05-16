'use strict';

const {product, electronic, clothing, furniture} = require('../../models/product.model.js');
const {Types} = require('mongoose')
const {getSelectData, unSelectData} = require('../../utils/index.js');

// search product by user
const searchProductByUser = async({keySearch}) => {
    const regexSearch = new RegExp(keySearch);
    const result = await product.find({ 
        isPublished: true,
        $text: { $search: regexSearch } },
        { 
            score: { $meta: 'textScore' } 
        })
    .sort({ score: { $meta: 'textScore' } })
    .lean();
    
    return result;
}

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

const findAllProducts = async ({limit, sort, page, filter, select})=>{
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1};
    const products = await product.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean();
    return products;
}

const findProducts = async ({product_id, unSelect})=>{
    //
    return await product.findById(product_id).select(unSelectData(unSelect))
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
    unPublishProductByShop,
    searchProductByUser,
    findAllProducts,
    findProducts
}
