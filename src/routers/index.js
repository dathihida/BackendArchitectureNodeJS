'use strict';

const express = require('express');
const { apiKey, permissions } = require('../auth/checkAuth.js');
const router = express.Router();

// check apikey
router.use(apiKey);
// check permission
router.use(permissions('0000'));

router.use('/v1/api', require('./access'));

module.exports = router;