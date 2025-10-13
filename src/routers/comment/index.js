'use strict';

const express = require('express');
const commentController = require('../../controllers/comment.controller.js');
const router = express.Router();
const asyncHandler = require('../../helpers/asyncHandler.js');
const { authenticationV2 } = require('../../auth/authUtils.js');

// authentication
// router.use(authentication)

// authenticationV2
router.use(authenticationV2)
/////////////////////////////

router.post('', asyncHandler(commentController.createComment))
router.get('', asyncHandler(commentController.getCommentsByParentId))
router.delete('', asyncHandler(commentController.deleteComments))
module.exports = router;