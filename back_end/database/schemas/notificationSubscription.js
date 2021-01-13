const mongoose = require('mongoose');

const { Schema } = mongoose;

const notificationSubscriptionSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  subscription: { type: Object },
  createdAt: {
    type: Date, required: true, default: Date.now,
  },
});

const notificationSubscriptionModel = mongoose.model('notificationSubscription', notificationSubscriptionSchema);

module.exports = notificationSubscriptionModel;
