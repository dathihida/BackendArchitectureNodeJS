'use strict';

const express = require('express');
const checkoutController = require('../../controllers/checkout.controller.js');
const router = express.Router();
const asyncHandler = require('../../helpers/asyncHandler.js');

// update
router.post('/review', asyncHandler(checkoutController.checkoutReview))

module.exports = router;