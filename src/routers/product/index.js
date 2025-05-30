'use strict';

const express = require('express');
const productController = require('../../controllers/product.controller.js');
const router = express.Router();
const asyncHandler = require('../../helpers/asyncHandler.js');
const { authenticationV2 } = require('../../auth/authUtils.js');

// authentication
// router.use(authentication)

//search
router.get('/search/:product_name', asyncHandler(productController.getListSearchProducts))
router.get('', asyncHandler(productController.findAllProducts))
router.get('/:product_id', asyncHandler(productController.findProducts))
// authenticationV2
router.use(authenticationV2)
/////////////////////////////

router.post('', asyncHandler(productController.createProduct))
router.patch('/:productId', asyncHandler(productController.updateProduct))
router.post('/publish/:id', asyncHandler(productController.publishProductByShop))
router.post('/publish/:id', asyncHandler(productController.unPublishProductByShop))

// Query
router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop))
// publish shop
router.get('/published/all', asyncHandler(productController.getAllPublishForShop))

module.exports = router;