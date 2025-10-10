'use strict'

const redis = require('redis');
const { promisify } = require('util');
const redisClient = redis.createClient();
const pexpire = promisify(redisClient.pexpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setnx).bind(redisClient);

const acquireLock = async (productId, quantity, cartId) => {
    const key = `lock_v2025_${productId}`;
    const retrtTimes = 10;
    const expireTime = 3000; // 3s tam lock

    for(let i = 0; i < retrtTimes.length; i++){
        // tao 1 key, ai giu thi duoc vao thanh toan
        const result = await setnxAsync(key, expireTime);
        console.log(`result::`, result)
        if(result === 1){
            // thao tac voi inventory
            const isReversation = await reservationInventory({productId, quantity, cartId});
            if(isReversation.modifiedCount){
                // thanh cong
                await pexpire(key, expireTime);
                return key;
            }
            return null;
        }else{
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }
}

const releaseLock = async keyLock => {
    const delAsyncKey = promisify(redisClient.del).bind(redisClient);
    return await delAsyncKey(keyLock);
}

module.exports = {
    acquireLock,
    releaseLock
}