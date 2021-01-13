const express = require('express');

const router = express.Router();

// Require controller modules.
const signupController = require('../controllers/signupController');
const signinController = require('../controllers/signinController');

// Require Middlewares
const { jwt } = require('../utils/auth');

const { authenticateToken } = jwt;

// Signup the user
router.post('/signup', signupController.signup_signup_post);

// Signin the user
router.post('/signin', signinController.signin_signin_post);

// Render the Signin Page with Google OAuth Page
router.get('/signin', signinController.signin_signin_get);

// Change the current user password
router.post('/password-change', authenticateToken, signinController.signin_passwordChange_post);

// forgot password
router.post('/forgot-password', signinController.signin_forgotPassword_post);

// code verification
router.post('/code-verification', signinController.signin_codeVerification_post);

// email verification
router.get('/:id/confirm-verification/:token', signinController.signin_emailVerification_get);

// reset password
router.post('/reset-password', authenticateToken, signinController.signin_resetPassword_post);

module.exports = router;
