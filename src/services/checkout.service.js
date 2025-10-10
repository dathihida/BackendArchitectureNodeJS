'use strict'

const { findCartById } = require("../models/repositories/cart.repo")
const{ BadRequestError, NotFoundError } = require('../core/error.response.js');
const { checkProductByServer } = require("../models/repositories/product.repo.js");
const {getDiscountAmount} = require("../services/discount.service.js")
const { orderModel } = require("../models/order.model.js");
/*
    //login and without login

    {
        cartId,
        userId,
        shop_order_ids:[
            {
                shopId,
                shop_discounts:[],
                item_products:[
                    {
                        price:,
                        quantity,
                        productId
                    }
                ]
            },
            {
                shopId,
                shop_discounts:[
                    {
                        "shopId",
                        "discountId",
                        "codeId"
                    }
                ],
                item_products:[
                    {
                        price:,
                        quantity,
                        productId
                    }
                ]
            },
        ]
    }
*/
class CheckoutService{
    static async checkoutReview({cartId, userId, shop_order_ids}){
        // checkout cartId exist
        const foundCart = await findCartById(cartId);
        if(!foundCart) throw new BadRequestError('Cart does not exists')
        
        const checkout_order = {
            totalPrice: 0, // tong tien hang
            feeShip: 0, // phi van chuyen
            totalDiscount: 0, // tong tien discount giam gia
            totalCheckout: 0 // tong thanh toan
        }, shop_order_ids_new = []

        // tinh tong tien bill
        for(let i = 0; i < shop_order_ids.length; i++){
            const {shopId, shop_discounts = [], item_products = []} = shop_order_ids[i];
            // check product available
            const checkoutProductServer = await checkProductByServer(item_products);
            console.log(`checkProductServer::`, checkoutProductServer)
            if(!checkoutProductServer[0]) throw new BadRequestError('order wrong !!')
            
            const checkoutPrice = checkoutProductServer.reduce((acc, product) =>{
                return acc + (product.quantity + product.price);
            }, 0)

            // tong tien truoc khi xu ly
            checkout_order.totalPrice =+ checkoutPrice

            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice, // check trc khi giam gia
                priceApplyDiscount: checkoutPrice,
                item_products: checkoutProductServer
            }

            // neu shop_discounts ton tai >0, check xem co hop le hay khong
            if(shop_discounts.length > 0){
                // gia su cho co 1 discount
                // get discount amount
                const {totalPrice = 0, discount = 0} = await getDiscountAmount({
                    codeId: shop_discounts[0].codeId,
                    userId,
                    shopId,
                    products: checkoutProductServer
                })

                //tong cong discount giam gia
                checkout_order.totalDiscount += discount

                if(discount > 0){
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }
            }
            // tong thanh cuoi cung
            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
            shop_order_ids_new.push(itemCheckout)
        }
        
        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }

    // order
    static async orderByUser({
        shop_order_ids,
        cartId,
        userId,
        user_address={},
        user_payment={}
    }){
        const {shop_order_ids_new, checkout_order} = await CheckoutService.checkoutReview({
            cartId,
            userId, 
            shop_order_ids
        })

        //check tai 1 lan nua xem co con hang khong
        //get new array Products
        const products = shop_order_ids_new.flatMap(order => order.item_products);
        console.log(`products::`, products)
        const acquireProduct = []
        for(let i = 0; i < products.length; i++){
            const{productId, quantity} = products[i];
            const keyLock = await acquireLock(productId, quantity, cartId);
            acquireProduct.push(keyLock ? true : false);
            if(keyLock){
                await releaseLock(keyLock);
            }
        }

        // check if co 1 sp het hang trong kho
        if(acquireProduct.includes(false)){
            throw new BadRequestError('Mot so sp da cap nhat, vui long kiem tra lai gio hang')
        }

        const newOrder = await orderModel.create({
            order_userId: userId,
            order_checkout: checkout_order,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products: shop_order_ids_new
        })

        // truong hop: new insert thanh cong, thi revome product co trong cart
        if(newOrder){
            // remove product in cart
            
        }
        return newOrder
    }

    /**
     * 1> Query Orders [Users]
     */
    static async getOrdersByUser(){

    }

    /**
     * 1> Query Orders Using Id [Users]
     */
    static async getOneOrdersByUser(){
        
    }

    /**
     * 1> Cancel Order [Users]
     */
    static async cancelOrdersByUser(){
        
    }

    /**
     * 1> Update Orders Status [Shop | Admin]
     */
    static async updateOrderStatusByShop(){
        
    }
}

module.exports = CheckoutService