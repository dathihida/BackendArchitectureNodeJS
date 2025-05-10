'use strict';

const AccessService = require("../services/access.service.js");
const { Ok, CREATE} = require("../core/success.response.js");
class AccessController {
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