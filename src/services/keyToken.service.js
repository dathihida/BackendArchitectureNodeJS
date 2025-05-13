'use strict';

const keytokenModels = require("../models/keytoken.models.js");
const {Types} = require("mongoose");
class KeyTokenService {
    static createKeyToken = async({userId, publicKey, privateKey, refreshToken})=>{
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
                publicKey, privateKey, refreshTokensUsed: [], refreshToken
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

    // static findByUserId = async(userId) => {   
    //     return await keytokenModels.findOne({userId: new Types.ObjectId(userId)}).lean()
    // }

    //v2
    static findByUserId = async(userId) => {   
        return await keytokenModels.findOne({userId: new Types.ObjectId(userId)})
    }

    static removeKeyById = async (id) => {
        return await keytokenModels.deleteOne({
            _id: new Types.ObjectId(id)
        });
    }


    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keytokenModels.findOne({ refreshTokensUsed: refreshToken }).lean();
    }

    static findByRefreshToken = async (refreshToken) => {
        return await keytokenModels.findOne({ refreshToken: refreshToken })
    }

    // static deleteKeyById = async (userId) => {
    //     return await keytokenModels.deleteOne({ user: new Types.ObjectId(userId) });
    // }

    static deleteKeyById = async (userId) => {
        return await keytokenModels.deleteMany({ userId: new Types.ObjectId(userId) });
    }

}

module.exports = KeyTokenService;