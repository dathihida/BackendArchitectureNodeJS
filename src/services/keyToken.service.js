'use strict';

const { filter, update } = require("lodash");
const keytokenModels = require("../models/keytoken.models.js");

class KeyTokenService {
    static createKeyToken = async({userId, publicKey, privateKey, refresherToken})=>{
        try {
            // thuat toan bat doi xung chua duoc hash nen phai chuyen doi sang string
            // const publicKeyString = publicKey.toString();
            
            // level 0
            // const tokens = await keytokenModels.create({
            //     userId: userId,
            //     publicKey,
            //     privateKey, 
            // })
            // console.log('Saved KeyToken:', tokens);
            // return tokens ? tokens.publicKey : null;  

            // level xxx
            const filter = { userId: userId }, update = {
                publicKey, privateKey, refreshTokensUsed: [], refresherToken
            }, options = {upsert: true, new: true}
            const tokens = await keytokenModels.findOneAndUpdate(filter, update, options)

            return tokens ? tokens.publicKey : null;
        } catch (error) {
            // return {
            //     code: 'xxx',
            //     message: error.message,
            //     status: 'error',
            // }
            return error            
        }
    }
}

module.exports = KeyTokenService;