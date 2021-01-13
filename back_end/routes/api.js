const express = require('express');

const router = express.Router();

// Require controller modules.
const authController = require('../controllers/authController');

// Process google OAuth Callback
router.get('/auth/google/callback', authController.auth_google_get);

// Process facebook OAuth Callback
router.get('/auth/facebook/callback', authController.auth_facebook_get);

// Process okta OAuth Callback
router.get('/auth/okta/callback', authController.auth_okta_get);

// Get twitter siginin page redirect
router.get('/auth/twitter/signin', authController.auth_twitterSignin_get);

// Get twitter OAuth Callback
router.get('/auth/twitter/callback', authController.auth_twitter_get);

module.exports = router;
