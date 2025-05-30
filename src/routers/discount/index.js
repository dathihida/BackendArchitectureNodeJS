'use strict';

const express = require('express');
const discountController = require('../../controllers/discount.controller.js');
const router = express.Router();
const asyncHandler = require('../../helpers/asyncHandler.js');
const { authenticationV2 } = require('../../auth/authUtils.js');

// get amount a discount code
router.post('/amount', asyncHandler(discountController.getDiscountAmount));
router.get('/list_product_code', asyncHandler(discountController.getAllDiscountCodesWithProducts));

// authentication
router.use(authenticationV2);

router.post('', asyncHandler(discountController.createDiscountCode));
router.get('', asyncHandler(discountController.getAllDiscountCodes));

module.exports = router;