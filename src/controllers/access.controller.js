'use strict';

const AccessService = require("../services/access.service.js");
const { OK, CREATE, SuccessResponse} = require("../core/success.response.js");
class AccessController {
    login = async(req, res, next) => {
        new SuccessResponse({
            metadata: await AccessService.login(req.body)
        }).send(res);
    }
    
    signUp = async(req, res, next) => {
        new CREATE({
            message: 'Register OK!!!',
            metadata: await AccessService.signUp(req.body),
            options: {
                limit: 10,
            }
        }).send(res);
    }
}
module.exports = new AccessController();