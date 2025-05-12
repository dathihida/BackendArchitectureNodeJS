'use strict'

const shopModel = require('../models/shop.models.js')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require('./keyToken.service.js')
const { createTokenPair } = require('../auth/authUtils.js')
const { getInfoData } = require('../utils/index.js')
const { BadRequestError } = require('../core/error.response.js')

// service
const { findByEmail } = require('./shop.service.js')

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
}

class AccessService {

    static logout = async (keyStore) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id);
        console.log(`delKey::`, delKey);
        return delKey;
    }

    /*
        1 - check email in db
        2 - match password
        3 - create AT vs RT and save
        4 - generate token
        5 - get data return login
    */
    static login = async({email, password, refreshToken}) => {

        // 1
        const foundShop = await findByEmail({email})
        if(!foundShop){
            throw new BadRequestError('Error: Shop not registered')
        }

        // 2
        const match = bcrypt.compare(password, foundShop.password)
        if(!match){
            throw new BadRequestError('Error: Authentication error')
        }

        // 3 create private key, public key 
        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');

        // 4
        const {_id: userId} = foundShop
        const tokens = await createTokenPair(
            {userId, email}, publicKey, privateKey)
        console.log(`Created Token Success::`,tokens);

        // 5
        await KeyTokenService.createKeyToken({
            refresherToken: tokens.refreshToken,
            publicKey,
            privateKey, userId
        })

        return {
            shop: getInfoData({fields: ['_id', 'name', 'email'], object: foundShop}), tokens,
        }
    }

    static signUp = async ({name, email, password}) => {
        // try {
            // step 1: check email exists
            const holderShop = await shopModel.findOne({ email }).lean()
            if(holderShop){
                throw new BadRequestError('Error: Shop already exists')
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
                    // return {
                    //     code: 'xxx',
                    //     message: 'keyStore error',
                    // }
                    throw new BadRequestError('Error: keyStore error')
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
                        shop: getInfoData({fields: ['_id', 'name', 'email'], object: newShop}),
                        tokens,
                    }
                }
            }
            return {
                code: 200,
                metadata: null,
            }

        // } catch (error) {
        //     console.log(`Error::`, error);
        //     return {
        //         code: 'xxx',
        //         message: error.message,
        //         status: 'error',
        //     }
        // }
    }
}

module.exports = AccessService;