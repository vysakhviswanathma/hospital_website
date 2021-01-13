const path = require('path');
const webpush = require('../utils/webPush');
const notificationSubscriptionModel = require('../models/notificationSubscription');

// GET client
exports.notification_client_get = (req, res) => {
  res.sendFile(path.join(__dirname, '../utils/webPush/client/index.html'));
};

// POST subscribe
exports.notification_subscribe_post = async (req, res, next) => {
  // get push subscriptionObject
  const subscription = req.body;

  try {
    // Save subscribtion to DB
    // NOTE: You may want to change the schema model according to your need
    await notificationSubscriptionModel.saveSubscription({ subscription });
    res.setHeader('Content-Type', 'application/json');
    res.status(201).json({ data: { success: true } });
  } catch (err) {
    next(err);
  }
};

// POST send-notification
// eslint-disable-next-line consistent-return
exports.notification_sendNotification_post = async (req, res, next) => {
  // payload
  const payload = JSON.stringify({ title: 'Test Notification' });

  try {
    const subscriptions = await notificationSubscriptionModel.getAllSubscription();
    if (subscriptions && subscriptions.length === 0) return res.status(401).json({ status: 'false', message: 'No subscriptions found in server.' });

    // For testing purpose, we are going to take the last subscription entry,
    // Probably, the last one will be the latest entry, which you may want to
    // receive the notification
    // Following operation returns the last element and removes it from the array
    const { subscription } = subscriptions.pop();
    webpush.sendNotification(subscription, payload)
      .then(() => res.status(200).json({ status: 'true', message: 'Notification send successfully.' }))
      .catch((err) => next(err));
  } catch (err) {
    return next(err);
  }
};
