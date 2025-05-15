'use strict';

const { product, electronic, clothing, furniture } = require('../models/product.model.js');
const {BadRequestError} = require('../core/error.response.js');

// define factory class to create product
class ProductFactoryV2{
    /*
        type: 'Clothing',
        payload
    */
    
    static productRegistry = {} // key-class

    static registerProductType(type, classRef){
        ProductFactoryV2.productRegistry[type] = classRef;
    }
    
    static async createProduct(type, payload){

        const productClass = ProductFactoryV2.productRegistry[type];
        if(!productClass) throw new BadRequestError(`Invalid product type ${type}`);

        return new productClass(payload).createProduct();
    }
}

/*
    product_name:{ type:String, required:true },
    product_thumb:{ type:String, required:true },
    product_description: String,
    product_price:{ type:Number, required:true },
    product_quantity:{ type:Number, required:true },
    product_type:{ type:String, required:true, enum: ['Clothing', 'Electronics', 'Furniture'] },
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop' },
    product_attributes: {type: Schema.Types.Mixed, required:true},
*/

// define base product class
class Product{
    constructor({
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_quantity,
        product_type,
        product_shop,
        product_attributes
    }){
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
    }

    //create new product
    async createProduct({product_id}){
        return await product.create({...this, _id: product_id});
    }
}

// define sub-class for different product types Clothing
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });
        if (!newClothing) throw new BadRequestError('create new Clothing error');

        const newProduct = await super.createProduct({ product_id: newClothing._id });
        if (!newProduct) throw new BadRequestError('create new Product error');

        return newProduct;
    }
}


// define sub-class for different product types Electronics
class Electronics extends Product{
    async createProduct(){
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });
        if(!newElectronic) throw new BadRequestError('create new Electronics error');

        const newProduct = await super.createProduct({ product_id: newElectronic._id });
        if(!newProduct) throw new BadRequestError('create new Product error');

        return newProduct;
    }
}

class Furniture extends Product{
    async createProduct(){
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });
        if(!newFurniture) throw new BadRequestError('create new Furniture error');

        const newProduct = await super.createProduct({ product_id: newFurniture._id });
        if(!newProduct) throw new BadRequestError('create new Product error');

        return newProduct;
    }
}

// register product types
//ProductFactory.registerProductType('Product', Product);

ProductFactoryV2.registerProductType('Clothing', Clothing);
ProductFactoryV2.registerProductType('Electronics', Electronics);
ProductFactoryV2.registerProductType('Furniture', Furniture);


module.exports = ProductFactoryV2;
