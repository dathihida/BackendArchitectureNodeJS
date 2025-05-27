'use strict'

const{ BadRequestError, NotFoundError } = require('../core/error.response.js');
const discountModel = require('../models/discount.model.js');
const {findAllProducts} = require('../models/repositories/product.repo.js');
const {convertObjectIdMongodb}=require('../utils/index.js');
const {findAllDiscountCodesUnSelect, checkDiscountExists,
        findAllDiscountCodesSelect} = require('../models/repositories/discount.repo.js');
const { model } = require('mongoose');
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
            name, code, start_date, end_date, users_used,
            is_active, shopId, min_order_value, 
            product_ids, applies_to, description, 
            type, value, max_value, max_uses, uses_count, max_uses_per_user
        } = payload;
        // Validate required fields
        // if(new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
        //     throw new BadRequestError('Discount code has expried!');
        // }

        // if(new Date(start_date) > new Date(end_date)) {
        //     throw new BadRequestError('Start date must be before end date!');
        // }

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
            discount_type: type, // 'fixed_amount' or 'percentage'
            discount_value: value, // 10.000 or 10%
            discount_min_order_value: min_order_value || 0,
            discount_max_value: max_value, // maximum value of the discount
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_uses: max_uses, // total uses of this code
            discount_uses_count: uses_count || 0, // how many times this code has been used
            discount_users_used: users_used, // array of userId who used this code
            discount_is_active: is_active,
            discount_shopId: shopId,
            discount_product_ids: applies_to === 'all' ? [] : product_ids,
            discount_applies_to: applies_to,
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
                select: ['product_name'],
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
        const discounts = await findAllDiscountCodesSelect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: convertObjectIdMongodb(shopId),
                discount_is_active: true
            },
            unSelect: ['discount_code', 'discount_name'],
            model: discountModel
        })
        return discounts;
    }

    /**
     * Apply discount code to order
     * products ={
        *   productId,
        *   shopId,
        *   quantity,
        *   price,
        *   name
     * },{
     *      productId,
        *   shopId,
        *   quantity,
        *   price,
        *   name
     * }
     */

    static async getDiscountAmount({codeId, userId, shopId, products}){
        const foundDiscount = await checkDiscountExists({
        
            model: discountModel, 
            filter: {
                discount_code: codeId,
                discount_shopId: convertObjectIdMongodb(shopId)
            }});

            if(!foundDiscount) throw new NotFoundError('Discount code not exists');

            const {
                discount_is_active,
                discount_max_uses,
                discount_min_order_value,
                discount_users_used,
                discount_max_uses_per_user,
                discount_type,
                discount_value,
                discount_start_date,
                discount_end_date
            } = foundDiscount;

            if(!discount_is_active) {
                throw new NotFoundError('Discount expired');
            }
            if(!discount_max_uses) {
                throw new NotFoundError('Discount are out');
            }
            if(new Date() < new Date(foundDiscount.discount_start_date) || 
                new Date() > new Date(foundDiscount.discount_end_date)) {
                throw new NotFoundError('Discount code has expired');
            }

            // check xem dis co gia tri toi tieu ko
            let totalOrder = 0;
            if(discount_min_order_value > 0){
                //get total
                totalOrder = products.reduce((acc, product) => {
                    return acc + (product.price * product.quantity);
                }, 0);
                if(totalOrder < discount_min_order_value) {
                    throw new 
                    NotFoundError(`Discount requires minimum order value of ${discount_min_order_value}`);
                }
            }
            
            if(discount_max_uses_per_user > 0){
                const userUserDiscount = 
                    discount_users_used.find(user => user.userId === userId);
            if(userUserDiscount){
                // ....
            }
        }

        const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100);
        
        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount,
        }
    }

    static async deleteDiscountCode({shopId, codeId}){
        const deleted = await discountModel.findOneAndDelete({
            discount_code: codeId,
            discount_shopId: convertObjectIdMongodb(shopId)
        })
        return deleted;
    }

    static async cancelDiscountCode({shopId, codeId, userId}) {
        const foundDiscount = await checkDiscountExists({
            model: discountModel, 
            filter: {
                discount_code: codeId,
                discount_shopId: convertObjectIdMongodb(shopId)
            }
        });
        if(!foundDiscount) throw new NotFoundError('Discount code not exists');
        if(!foundDiscount.discount_is_active) {
            throw new NotFoundError('Discount code is not active');
        }
        if(new Date() < new Date(foundDiscount.discount_start_date) || 
            new Date() > new Date(foundDiscount.discount_end_date)) {
            throw new NotFoundError('Discount code has expired');
        }
        const result = await discountModel.findByIdAndUpdate(
            foundDiscount._id, {
                $pull:{
                    discount_users_used: userId,
                },
                $inc:{
                    discount_uses_count: -1,
                    discount_max_uses: 1
                }
            }
        );
        return result;
    }
}

module.exports = DiscountService;


