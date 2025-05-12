'use strict';
const JWT = require('jsonwebtoken');
const asyncHandler = require('../helpers/asyncHandler.js');
const { AuthFailedError, NotFoundError } = require('../core/error.response.js');

//service
const { findByUserId } = require('../services/keyToken.service.js');

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
}

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = JWT.sign(payload, publicKey, {
            expiresIn: '2 days',
        })

        const refreshToken = JWT.sign(payload, privateKey, {
            expiresIn: '7 days',
        })

        //
        JWT.verify(accessToken, publicKey,(err, decode) => {
            if(err){
                console.error(`error verify::`, err);
            }else{
                console.log(`decode verify::`, decode);
            }
        })
        return {
            accessToken,
            refreshToken,
        }

    } catch (error) {
        
    }
}

const authentication = asyncHandler(async (req, res, next) => {
    /*
        1 - Check userId missing ???
        2 - get accessToken
        3 - verifyToken
        4 - check user in bds
        5 - check keyStore with userId
        6 - OK all -> return next()
    */
    const userId = req.headers[HEADER.CLIENT_ID]
    if(!userId) throw new AuthFailedError('Invalid Request 01')
    
    // 2
    const keyStore = await findByUserId(userId)
    if(!keyStore) throw new NotFoundError('Not Found keyStore')

    // 3
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if(!accessToken) throw new AuthFailedError('Invalid Request 02')

    // 5
    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if(userId !== decodeUser.userId) throw new AuthFailedError('Invalid UserId')
        req.keyStore = keyStore
        return next();
    } catch (error) {
        throw error;
    }
})

module.exports = {
    createTokenPair,
    authentication
}