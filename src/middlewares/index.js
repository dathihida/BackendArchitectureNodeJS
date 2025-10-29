'use strict'

const Logger = require('../loggers/discord.log.v2.js');

const pushToLogDiscord = async (req, res, next) => {
    try{
        Logger.sendToMessage(req.get('host'))
        return next()
    }catch(error){
        next(error)
    }
}

module.exports = {
    pushToLogDiscord
}