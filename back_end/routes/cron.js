const express = require('express');

const router = express.Router();

// Require controller modules.
const cronjobController = require('../controllers/cronjobController');

// start cronjob
router.get('/schedule', cronjobController.cronjob_schedule_get);

// stop cronjob
router.get('/stop/:job', cronjobController.cronjob_stop_get);


module.exports = router;
