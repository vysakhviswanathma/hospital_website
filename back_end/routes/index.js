const express = require('express');

const router = express.Router();

// Swagger
const { swaggerUi, swaggerSpec } = require('../utils/swagger');

/**
 * Routes
 */
const api = require('./api');
const user = require('./user');
const email = require('./email');
const root = require('./root');
const push = require('./push');
const twilio = require('./twilio');
const nexmo = require('./nexmo');
const okta = require('./okta');
const cron = require('./cron');

router.use('/api', api);
router.use('/user', user);
router.use('/email', email);
router.use('/', root);
router.use('/push', push);
router.use('/twilio', twilio);
router.use('/nexmo', nexmo);
router.use('/okta', okta);
router.use('/cron', cron);

// Enpoint serving API DOC using Swagger
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = router;
