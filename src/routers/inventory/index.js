'use strict';

const express = require('express');
const inventoryController = require('../../controllers/inventory,controller.js');
const router = express.Router();
const asyncHandler = require('../../helpers/asyncHandler.js');
const { authenticationV2 } = require('../../auth/authUtils.js');

router.use(authenticationV2)
router.post('/review', asyncHandler(inventoryController.addStockToInventory));

module.exports = router;