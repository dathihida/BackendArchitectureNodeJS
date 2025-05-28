'use strict';

const express = require('express');
const cartController = require('../../controllers/cart.controller.js');
const router = express.Router();
const asyncHandler = require('../../helpers/asyncHandler.js');
const { authenticationV2 } = require('../../auth/authUtils.js');

// update
router.post('', asyncHandler(cartController.addToCart))
router.delete('', asyncHandler(cartController.delete))
router.post('/update', asyncHandler(cartController.updateToCart))
router.get('', asyncHandler(cartController.listToCart))

module.exports = router;