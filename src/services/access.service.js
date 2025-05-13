'use strict'

const shopModel = require('../models/shop.models.js')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require('./keyToken.service.js')
const { createTokenPair, verifyJWT } = require('../auth/authUtils.js')
const { getInfoData } = require('../utils/index.js')
const { BadRequestError, ForbiddenError, AuthFailedError } = require('../core/error.response.js')

// service
const { findByEmail } = require('./shop.service.js')
const { console } = require('inspector')

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
}

class AccessService {

    static handlerRefreshTokenV2 = async ({keyStore, user, refreshToken}) => {

        const {userId, email} = user;

        if(keyStore.refreshTokensUsed.includes(refreshToken)){
            await KeyTokenService.deleteKeyById(userId);
            throw new ForbiddenError('Something wrong happened, please login again')
        }

        if(keyStore.refreshToken !== refreshToken) throw new AuthFailedError('Shop not registered 01')
        
        const foundShop = await findByEmail({email})
        if(!foundShop) throw new AuthFailedError('Shop not registered 02')
        
        // create 1 cap moi
        const tokens = await createTokenPair({userId, email}, keyStore.publicKey, keyStore.privateKey)
        
        // update token
        await keyStore.updateOne({
            $set:{
                refreshToken: tokens.refreshToken,
            },
            $addToSet:{
                refreshTokensUsed: refreshToken // da duoc su dung lay token moi
            }
        })

        return {
            user,
            tokens
        }
    }

    /*
        check this token used
    */
    static handlerRefreshToken = async (refreshToken) => {

        // check token in used
        const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken);
        // if exists
        if(foundToken){
            // decode 
            const {userId, email} = await verifyJWT(refreshToken, foundToken.privateKey);
            console.log(`foundToken::`,{userId, email});
            // delete token in keyStore
            await KeyTokenService.deleteKeyById(userId);
            throw new ForbiddenError('Something wrong happened, please login again')
        }

        // No token in used
        console.log(`RefreshToken in used::`, refreshToken);
        const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
        console.log(`holderToken::`, holderToken);
        if(!holderToken) throw new AuthFailedError('Shop not registered 01')
        
        // verify token
        const {userId, email} = await verifyJWT(refreshToken, holderToken.privateKey);
        console.log(`[2]--`, {userId, email});
        
        // check userId
        const foundShop = await findByEmail({email})
        if(!foundShop) throw new AuthFailedError('Shop not registered 02')
        
        // create 1 cap moi
        const tokens = await createTokenPair({userId, email}, holderToken.publicKey, holderToken.privateKey)
        
        // update token
        await holderToken.updateOne({
            $set:{
                refreshToken: tokens.refreshToken,
            },
            $addToSet:{
                refreshTokensUsed: refreshToken // da duoc su dung lay token moi
            }
        })

        return {
            user: {userId, email},
            tokens
        }
    }

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
            refreshToken: tokens.refreshToken,
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