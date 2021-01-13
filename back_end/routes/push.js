const express = require('express');

const router = express.Router();

const notificationController = require('../controllers/notificationController');

// register service worker and send subscription to push server
// router.get('/register', pushController.send_subscription_to_push_server );

// Load and register service worker at client
router.get('/client', notificationController.notification_client_get);

// Save subscription to the database
router.post('/subscribe', notificationController.notification_subscribe_post);

// Send push notification - test API
router.post('/send-notification', notificationController.notification_sendNotification_post);

module.exports = router;
