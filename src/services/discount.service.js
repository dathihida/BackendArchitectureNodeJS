'use strict'

const{ BadRequestError, NotFoundError } = require('../core/error.response.js');
const discountModel = require('../models/discount.model.js');
const {convertObjectIdMongodb}=require('../utils/index.js');
const {findAllDiscountCodesUnSelect, 
        findAllDiscountCodesSelect} = require('../models/repositories/discount.repo.js');
/*
    Discount Service
    1- Generator discount code [Shop | Admin]
    2- Get all discounts codes [User | Shop]
    3- Get discount amount [User] 
    4- update discount, 
    5- delete discount, 
    6- cancel discount code
*/

class DiscountService {
    static async createDiscountCode(payload){
        const {
            name, code, start_date, end_date, 
            is_active, shopId, min_order_value, 
            product_ids, applies_to, description, 
            type, value, max_value, max_uses, uses_count, max_uses_per_user
        } = payload;
        // Validate required fields
        if(new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
            throw new BadRequestError('Discount code has expried!');
        }

        if(new Date(start_date) > new Date(end_date)) {
            throw new BadRequestError('Start date must be before end date!');
        }

        // create index for discount code
        const foundDiscount = await discountModel.findOne({ 
            discount_code: code,
            discount_shopId: convertObjectIdMongodb(shopId)
        }).lean()

        if(foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRequestError('Discount code already exists!');
        }

        const newDiscount = await discountModel.create({
            discount_name: name,
            discount_description: description,
            discount_code: code,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_is_active: is_active,
            discount_shopId: shopId,
            discount_min_order_value: min_order_value || 0,
            discount_product_ids: applies_to === 'all' ? [] : product_ids,
            discount_applies_to: applies_to,
            discount_type: type, // 'fixed_amount' or 'percentage'
            discount_value: value, // 10.000 or 10%
            discount_max_value: max_value, // maximum value of the discount
            discount_max_uses: max_uses, // total uses of this code
            discount_uses_count: uses_count || 0, // how many times this code has been used
            discount_max_uses_per_user: max_uses_per_user // how many times a user can use this code
        });

        return newDiscount;
    }

    static async updateDiscountCode(discountId, payload) {

    }


    /**
     * Get all discount codes for a shop
     */
    static async getAllDiscountCodesWithProduct({
        code, shopId, userId, limit, page
    }) {
        // create index for discount code
        const foundDiscount = await discountModel.findOne({ 
            discount_code: code,
            discount_shopId: convertObjectIdMongodb(shopId)
        }).lean()

        if(!foundDiscount || !foundDiscount.discount_is_active) {
            throw new NotFoundError('Discount code not exists');
        }

        const {discount_applies_to, discount_product_ids} = foundDiscount;
        
        let products;
        if(discount_applies_to === 'all') {
            // get all product
            products = await findAllProducts({
                filter: {
                    product_shop: convertObjectIdMongodb(shopId),
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }

        if(discount_applies_to === 'specific') {
            products = await findAllProducts({
                filter: {
                    _id: { $in: discount_product_ids },
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }

        return products
    }

    /**
     * Get all discount code of shop
     */

    static async getAllDiscountCodesByShop({
        shopId, limit, page, 
    }){
        const discounts = await findAllDiscountCodesUnSelect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: convertObjectIdMongodb(shopId),
                discount_is_active: true
            },
            unSelect: ['__v', 'discount_shopId'],
            model: discountModel
        })
        return discounts;
    }
}


