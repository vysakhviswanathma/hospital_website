/* eslint-disable camelcase */
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const saltRounds = 12;
// Require Models
const userModel = require('../models/user');
const emailVerificationModel = require('../models/emailVerification');
const { mongodb: mongodbStatusCode } = require('../utils/statusCode');
// Require Mail service
const mailService = require('../utils/mailService')('sendGrid');

// Helper Function to generate token
function generateToken({ stringBase = 'base64', byteLength = 48 } = {}) {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(byteLength, (err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer.toString(stringBase));
      }
    });
  });
}

// Create post user
async function signup_signup_post(req, res, next) {
  const { body: reqBody } = req;
  const {
    firstName, lastName, email, password,
  } = reqBody;

  if (!(firstName && lastName && email && password)) {
    return res.status(400).json({ status: false, message: 'Missing parameters' });
  }

  try {
    // Hash Password
    const passwordHash = await bcrypt.hash(password, saltRounds);
    reqBody.password = passwordHash;
    // Save user data to db
    const doc = await userModel.createUser(reqBody);

    // Generate token for email verification
    const token = await generateToken();

    const verificationData = {
      _userId: doc.id,
      token,
    };

    // Save email verification token to db
    const { id: tokenId } = await emailVerificationModel.saveToken(verificationData);

    // Send email verification
    const msgPayload = {
      to: email,
      subject: 'Verify Email Address',
      type: 'sighnupEmailVerification',
      template: 'confirmationEmail.mustache',
      templateData: {
        appName: 'Sample App',
        verificationLink: `${process.env.BASE_URL}/email/${tokenId}/confirm-verification/${encodeURIComponent(token)}`,
        address: 'Sample Company, Sample Place, Sample Country',
      },
    };
    await mailService.sendMail(msgPayload);

    return res.status(201).json({ status: true, message: 'User created successfullly' });
  } catch (err) {
    if (err.code === mongodbStatusCode.DUPLICATE_KEY_ERROR.code) return res.status(401).json({ status: false, message: 'User already exists.' });
    return next(err);
  }
}

module.exports = {
  signup_signup_post,
};
