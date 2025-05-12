'use strict';

const express = require('express');
const accessController = require('../../controllers/access.controller.js');
const router = express.Router();
const asyncHandler = require('../../helpers/asyncHandler.js');
const { authentication } = require('../../auth/authUtils.js');



// signUp
router.post('/shop/signup', asyncHandler(accessController.signUp))

// login
router.post('/shop/login', asyncHandler(accessController.login))

// authentication
router.use(authentication)

// logout
router.post('/shop/logout', asyncHandler(accessController.logout))

module.exports = router;