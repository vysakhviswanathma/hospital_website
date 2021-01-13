const mongoose = require('mongoose');

const { Schema } = mongoose;

const emailVerificationsSchema = new Schema({
  _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  token: { type: String, required: true },
  createdAt: {
    type: Date, required: true, default: Date.now, expires: 60 * 60,
  },
});

const emailVerificationsModel = mongoose.model('emailVerifications', emailVerificationsSchema);

module.exports = emailVerificationsModel;
