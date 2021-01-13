const NotificationSubscriptionModel = require('../database').models.notificationSubscription;

// Save subscription
const saveSubscription = async (data) => {
  const { subscription } = data;
  const notificationSubscriptionModel = new NotificationSubscriptionModel();
  notificationSubscriptionModel.subscription = subscription;
  const doc = await notificationSubscriptionModel.save();
  return doc;
};

// Get all subscriptions
const getAllSubscription = async () => {
  const projection = { _id: 0, subscription: 1 };
  const doc = await NotificationSubscriptionModel.find({}, projection);
  return doc;
};

module.exports = {
  saveSubscription,
  getAllSubscription,
};
