/* eslint-disable camelcase */
const emailVerificationModel = require('../models/emailVerification.js');
const userModel = require('../models/user.js');

// Create get confirm-verification
async function email_confirmVerification_get(req, res, next) {
  const { params: verificationData } = req;
  const { id, token } = verificationData;

  if (!(id && token)) {
    return res.status(400).json({ status: false, message: 'Missing parameters' });
  }

  try {
    // Validate id and token combination
    const emailVerificationDoc = await emailVerificationModel.validateToken(verificationData);

    // When id and token combination is invalid
    if (emailVerificationDoc === null) {
      return res.status(403).json({ status: false, message: 'Invalid verification link' });
    }

    const { id: emailVerificationId, _userId: userId } = emailVerificationDoc;

    // When id and token combination is valid; Verify user
    await userModel.updateIsVerified({ userId, isVerified: true });

    // Delete the email Token
    await emailVerificationModel.deleteToken(emailVerificationId);

    return res.status(201).json({ status: true, message: 'Email verification successfull' });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  email_confirmVerification_get,
};
