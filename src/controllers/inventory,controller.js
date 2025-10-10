'use strict'

const InventoryService = require("../services/inventory.service.js");
const { SuccessResponse } = require("../core/success.response.js");

class InventoryController {
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
    addStockToInventory = async(req, res, next)=>{
        // new
        new SuccessResponse({
            message: 'Create new Cart addStockToInventory',
            metadata: await InventoryController.addStockToInventory(req.body)
        }).send(res)
    }
}
module.exports = new InventoryController();