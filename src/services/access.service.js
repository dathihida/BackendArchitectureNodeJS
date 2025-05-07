'use strict'

const shopModel = require('../models/shop.models.js')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require('./keyToken.service.js')
const { createTokenPair } = require('../auth/authUtils.js')
const { getInfoData } = require('../utils/index.js')

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
}

class AccessService {
    static signUp = async ({name, email, password}) => {
        try {
            // step 1: check email exists
            const holderShop = await shopModel.findOne({ email }).lean()
            if(holderShop){
                return {
                    code: 'xxx',
                    message: 'Shop already registered',
                }
            }

            // step 2a: hash password
            const passwordHash = await bcrypt.hash(password, 10)

            // step 2b: create new shop
            const newShop = await shopModel.create({
                name,
                email,
                password: passwordHash,
                roles: [RoleShop.SHOP], 
            })

            // step 3: token 
            if(newShop){
                // create private key, public key
                // const { privateKey, publicKey }  = crypto.generateKeyPairSync('rsa', {
                //     modulusLength: 4096,
                //     publicKeyEncoding: {
                //         type: 'pkcs1',
                //         format: 'pem', 
                //     },
                //     privateKeyEncoding: {
                //         type: 'pkcs1',
                //         format: 'pem', 
                //     },
                // })

                const privateKey = crypto.randomBytes(64).toString('hex');
                const publicKey = crypto.randomBytes(64).toString('hex');
                // public key CryptoGraphy Standard
                
                console.log({privateKey, publicKey}); // save collection KeyStore

                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey
                })

                if(!keyStore){
                    return {
                        code: 'xxx',
                        message: 'keyStore error',
                    }
                }



                // console.log(`publicKeyString::`, publicKeyString);

                // const publicKeyObject = crypto.createPublicKey(publicKeyString)
                // console.log(`publicKeyObject::`, publicKeyObject);


                // created token pair
                const tokens = await createTokenPair(
                    {userId: newShop._id, email}, publicKey, privateKey)
                console.log(`Created Token Success::`,tokens);

                return {
                    code: 201,
                    metadata: {
                        // shop: {
                        //     _id: newShop._id,
                        //     name: newShop.name,
                        //     email: newShop.email,
                        // },
                        shop: getInfoData({fields: ['_id', 'name', 'email'], object: newShop}),
                        tokens,
                    }
                }
            }
            return {
                code: 200,
                metadata: null,
            }

        } catch (error) {
            console.log(`Error::`, error);
            return {
                code: 'xxx',
                message: error.message,
                status: 'error',
            }
        }
    }
}

module.exports = AccessService;