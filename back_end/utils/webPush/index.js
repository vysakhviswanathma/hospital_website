const webpush = require('web-push');

/**
 * Confugure web-push service
 * @param {string} mailto
 */
const configure = (mailto) => {
  // Setting web push
  webpush.setVapidDetails(mailto,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY);
};

const sendNotification = (subscription, payload) => webpush.sendNotification(subscription, payload);

module.exports = {
  configure,
  sendNotification,
};
