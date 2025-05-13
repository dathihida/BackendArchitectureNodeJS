'use strict';

const apikeyModels = require("../models/apikey.models.js");
const crypto = require("crypto");

const findById = async (key) => {
    // const newKey = await apikeyModels.create({key: crypto.randomBytes(64).toString('hex'), permissions:['0000']});
    // console.log(newKey);
    const objKey = await apikeyModels.findOne({key, status: true}).lean();
    return objKey;
}

module.exports = {
    findById
}