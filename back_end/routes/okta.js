const express = require('express');

const router = express.Router();

// Require controller modules.
const testController = require('../controllers/testController');

// Require Middlewares
const { oktaValidator } = require('../utils/auth');

const { authenticateToken } = oktaValidator;

// Test route to validate okta access token
router.post('/secure-resource', authenticateToken, testController.test_secureResource_get);

module.exports = router;
