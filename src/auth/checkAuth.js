'use strict';

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
}

const {findById} = require('../services/apiKey.service.js');

const apiKey = async (req, res, next) => {
    try {
        console.log('apiKey middleware triggered');
        const key = req.headers[HEADER.API_KEY]?.toString();
        if (!key) {
            return res.status(403).json({
                message: 'Forbidden Error 01 - No API Key EXIST',
            });
        }

        // check objectKey
        const objectKey = await findById(key);
        if (!objectKey) {
            return res.status(403).json({
                message: 'Forbidden Error 02 - No API Key EXIST IN DB',
            });
        }
        req.objectKey = objectKey
        return next();

    } catch (error) {
        console.error('apiKey error:', error);
        return res.status(500).json({
            message: 'Internal Server Error in apiKey middleware',
        });
    }
}

const permissions = (permissions) =>{
    return (req, res, next)=>{
        if(!req.objectKey.permissions){
            return res.status(403).json({
                message: 'Permissions denied',
            });
        }

        console.log('permissions::', req.objectKey.permissions);
        const validPermissions = req.objectKey.permissions.includes(permissions);
        if(!validPermissions){
            return res.status(403).json({
                message: 'Permissions denied',
            });
        }

        return next();
    }
}

module.exports = {
    apiKey,
    permissions
}