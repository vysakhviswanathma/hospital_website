const express = require('express');

const router = express.Router();

// Require controller modules.

const nexmoController = require('../controllers/testController');

// send code

router.post('/verify', nexmoController.nexmo_verify);

// verify code

router.post('/check', nexmoController.nexmo_check);

// cancel request

router.post('/cancel', nexmoController.nexmo_cancel);

module.exports = router;
