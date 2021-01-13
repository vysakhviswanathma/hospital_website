const express = require('express');

const router = express.Router();

// Require controller modules.

const twilioController = require('../controllers/testController');

// send code via sms

router.get('/:phoneNumber/verify/:channel', twilioController.twilio_login);

// verify code

router.get('/:phoneNumber/check/:code', twilioController.twilio_verify);

module.exports = router;
