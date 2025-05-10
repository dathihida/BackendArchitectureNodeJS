'use strict';

const express = require('express');
const accessController = require('../../controllers/access.controller.js');
const router = express.Router();
const {asyncHandler} = require('../../auth/checkAuth.js');


// signUp
router.post('/shop/signup', asyncHandler(accessController.signUp))

module.exports = router;