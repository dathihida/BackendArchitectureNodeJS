'use strict';

const keytokenModels = require("../models/keytoken.models.js");

class KeyTokenService {
    static createKeyToken = async({userId, publicKey, privateKey})=>{
        try {
            // thuat toan bat doi xung chua duoc hash nen phai chuyen doi sang string
            // const publicKeyString = publicKey.toString();
            const tokens = await keytokenModels.create({
                userId: userId,
                publicKey,
                privateKey, 
            })
            console.log('Saved KeyToken:', tokens);
            return tokens ? tokens.publicKey : null;  
        } catch (error) {
            return {
                code: 'xxx',
                message: error.message,
                status: 'error',
            }
            
        }
    }
}

module.exports = KeyTokenService;