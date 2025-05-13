'use strict';

const express = require('express');
const accessController = require('../../controllers/access.controller.js');
const router = express.Router();
const asyncHandler = require('../../helpers/asyncHandler.js');
const { authentication, authenticationV2 } = require('../../auth/authUtils.js');

// signUp
router.post('/shop/signup', asyncHandler(accessController.signUp))

// login
router.post('/shop/login', asyncHandler(accessController.login))

// authentication
// router.use(authentication)

// authenticationV2
router.use(authenticationV2)

// logout
router.post('/shop/logout', asyncHandler(accessController.logout))

// handler refreshToken
router.post('/shop/handlerRefreshToken', asyncHandler(accessController.handlerRefreshToken))

module.exports = router;