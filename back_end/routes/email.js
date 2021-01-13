const express = require('express');

const router = express.Router();

// Require controller modules.
const emailController = require('../controllers/emailController');

// Email verification link
router.get('/:id/confirm-verification/:token', emailController.email_confirmVerification_get);

module.exports = router;
