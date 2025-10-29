'use strict';

const express = require('express');
const notificationController = require('../../controllers/notification.controller.js');
const router = express.Router();
const asyncHandler = require('../../helpers/asyncHandler.js');
const { authenticationV2 } = require('../../auth/authUtils.js');

// Here not login
// authentication
// router.use(authentication)

// authenticationV2
router.use(authenticationV2)
/////////////////////////////

router.get('', asyncHandler(notificationController.listNotiByUser));
module.exports = router;