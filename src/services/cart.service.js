'use strict'

const {cartModel} = require("../models/cart.model.js")
const{ BadRequestError, NotFoundError } = require('../core/error.response.js');
const { getProductById } = require("../models/repositories/product.repo.js");

/**
 * Key features of Cart Service
 * add product to cart
 * reduce product quantity by one user
 * increase product quantity by one user
 * get cart
 * delete cart
 * delete cart item
 */

class CartService {
    // START REPO CART
    static async createUserCart({userId, product}){
        const query = { cart_userId: userId, cart_state: 'active' };
        const updateOrInsert = {
            $addToSet: {
                cart_products: product
            }
        };
        const options = { upsert: true, new: true };
        return await cartModel.findOneAndUpdate(query, updateOrInsert, options);
    }

    static async updateUserCartQuantity({userId, product}){
        const { productId, quantity } = product;
        const query = {
            cart_userId: userId,
            'cart_products.productId': productId,
            cart_state: 'active'
        }, updateSet = {
            $inc:{
                'cart_products.$.quantity': quantity
            }
        }, options = {upsert: true, new: true};
        return await cartModel.findOneAndUpdate(query, updateSet, options);
    }
    // END REPO CART
    static async addToCart({userId, product = {}}){
        // check cart exists for user or not exists
        const userCart = await cartModel.findOne({cart_userId: userId});
        if(!userCart){
            // create new cart for User
            return await CartService.createUserCart({userId, product});
        }

        // neu co gio hang nhung chua co sp
        if(!userCart.cart_products.length){
            userCart.cart_products = [product];
            return await userCart.save();
        }

        // gio hang ton tai va co sp nay thi update quantity
        return await CartService.updateUserCartQuantity({userId, product});
    }

    // update quantity of product in cart
    /*
        shop_order_ids: [
            {
                shopId,
                item_products: [
                    {
                        quantity,
                        price,
                        shopId,
                        old_quantity,
                        productId,
                    }
                ],
                version: khoa lac quan, khoa bi quan, khoa thong thai
            }
        ]
    */
    static async addToCartV2({userId, shop_order_ids = {}}){
        const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_products[0];
        console.log({ productId, quantity, old_quantity })
        // check product 
        const foundProduct = await getProductById(productId);
        if(!foundProduct) {
            throw new NotFoundError(`Product not found with id: ${productId}`);
        }

        // compare 
        if(foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId){
            throw new NotFoundError(`Shop product not match with shopId: ${shop_order_ids[0]?.shopId}`);
        }

        if(quantity === 0){
            // delete
        }

        return await CartService.updateUserCartQuantity({
            userId,
            product: {
                productId,
                quantity: quantity - old_quantity
            }
        });
    }

    static async deleteUserCart({userId, productId}){
        const query = {
            cart_userId: userId,
            cart_state: 'active'
        },
        updateSet = {
            $pull: {
                cart_products: { productId }
            }
        };

        const deleteCart = await cartModel.updateOne(query, updateSet);
        
        return deleteCart;
    }

    static async getListUserCart({userId}){
        return await cartModel.findOne({cart_userId: +userId}).lean();
    }
}

module.exports = CartService;