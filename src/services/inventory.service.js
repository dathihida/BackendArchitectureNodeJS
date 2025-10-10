'use strict'

const { BadRequestError } = require("../core/error.response.js");
const {inventory} = require("../models/repositories/inventory.repo.js");
const { getProductById } = require("../models/repositories/product.repo.js");

class InventoryService{
    static async addStockToInventory({
        stock,
        productId,
        shopId,
        location = '132, abc street, HCM'
    }){
        const product = await getProductById(productId);
        if(!product) throw new BadRequestError('The product does not exists');
        const query = { inven_productId: productId, inven_shopId: shopId }, 
        updateSet = {
            $inc: {inven_stock: stock},
            $set:{inven_location: location}
        }, options = {upsert: true, new: true};
        return await inventory.findOneAndUpdate(query, updateSet, options);
    }
}

module.exports = InventoryService;