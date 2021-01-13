/* eslint-disable camelcase */
const randomNumber = require('random-number-csprng');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { googleOAuth, facebookOAuth, oktaOAuth } = require('../utils/auth');
const emailVerificationModel = require('../models/emailVerification.js');
const userModel = require('../models/user.js');
const { jwt } = require('../utils/auth');

const saltRounds = 12;
const { generateToken } = jwt;

// Require Mail service
const mailService = require('../utils/mailService')('sendGrid');

// Helper Function to generate token
function generate_token({ stringBase = 'base64', byteLength = 48 } = {}) {
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

// Create post signin
async function signin_signin_post(req, res, next) {
  const { body: reqBody } = req;
  const { email, password } = reqBody;

  if (!(email && password)) {
    return res.status(400).json({ status: false, message: 'Missing parameters' });
  }

  try {
    // Need to fetch the data for the verified contacts only
    reqBody.isVerified = true;
    const user = {
      email,
      isVerified: true,
    };

    // Find the user
    const userData = await userModel.findUser(user);

    // userData will be null if email doesn't exists
    if (!userData) {
      return res.status(401).json({ status: false, message: 'Invalid user credentials.' });
    }

    const { password: passwordHash, id: userId } = userData;

    // compare hash for the password
    const isValidPassword = await bcrypt.compare(password, passwordHash);

    if (isValidPassword) {
      const payLoad = {
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        userId,
      };

      const token = await generateToken(payLoad);

      return res.status(201).json({ status: true, message: 'User signin successfull', token });
    }
    return res.status(401).json({ status: false, message: 'Invalid password.' });
  } catch (err) {
    return next(err);
  }
}

// Create get signin
async function signin_signin_get(req, res, next) {
  try {
    // Redirect URI for Google OAuth
    const googleRedirectUri = `${process.env.BASE_URL}/api/auth/google/callback`;

    // Redirect URI for Facebook OAuth
    const facebookRedirectUri = `${process.env.BASE_URL}/api/auth/facebook/callback`;

    // Redirect URI for Okta OAuth
    const oktaRedirectUri = `${process.env.BASE_URL}/api/auth/okta/callback`;

    const googleLoginUri = googleOAuth.getGoogleLoginUri(googleRedirectUri);

    const facebookLoginUri = facebookOAuth.getFacebookLoginUri(facebookRedirectUri);

    const oktaUri = oktaOAuth.getOktaLoginUri(oktaRedirectUri);

    const twitterUri = `${process.env.BASE_URL}/api/auth/twitter/signin`;

    return res.json({
      googleLoginUri, facebookLoginUri, oktaUri, twitterUri,
    });
  } catch (err) {
    return next(err);
  }
}

// Create post password-change
async function signin_passwordChange_post(req, res, next) {
  const { body: reqBody, payLoad } = req;
  const { currentPassword, newPassword } = reqBody;
  const { userId } = payLoad;

  if (!(currentPassword && newPassword)) {
    return res.status(400).json({ status: false, message: 'Missing parameters' });
  }

  try {
    // Find the user
    const filter = {
      isVerified: true,
      _id: userId,
    };
    const userData = await userModel.findUser(filter);

    // userData will be null if email doesn't exists
    if (!userData) {
      return res.status(401).json({ status: false, message: 'Invalid user credentials.' });
    }

    const { password: passwordHash } = userData;

    // compare hash for the password
    const isValidPassword = await bcrypt.compare(currentPassword, passwordHash);

    if (isValidPassword) {
      // Hash new Password
      const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);
      // Update Password
      const passwordUpdateData = {
        id: userId,
        password: newPasswordHash,
      };

      await userModel.updatePassword(passwordUpdateData);

      return res.status(201).json({ status: true, message: 'User password change successfull' });
    }

    return res.status(401).json({ status: false, message: 'Invalid password.' });
  } catch (err) {
    return next(err);
  }
}

// create post forgot-password
async function signin_forgotPassword_post(req, res, next) {
  const { email } = req.body;

  try {
    // Find the user
    const filter = {
      isVerified: true,
      email,
    };

    const userData = await userModel.findUser(filter);

    // userData will be null if email doesn't exists
    if (!userData) {
      return res.status(401).json({ status: false, message: 'Invalid user credentials.' });
    }

    // create resetToken
    const token = await generate_token();

    const verificationData = {
      _userId: userData.id,
      token,
    };

    // Save email verification token to db
    const { id: tokenId } = await emailVerificationModel.saveToken(verificationData);

    // create random number
    const randNumber = await randomNumber(100000, 999999);


    const hashCode = await bcrypt.hash(`${randNumber}`, saltRounds);

    // console.log(randNumber);
    const update = {
      resetCode: hashCode,
    };

    await userModel.update({ id: userData.id, filter: update });
    // Send email verification
    const msgPayload = {
      to: email,
      subject: 'Password Reset Email',
      template: 'resetPasswordEmail&Code.mustache',
      templateData: {
        appName: 'Sample App',
        code: randNumber,
        ResetLink: `${process.env.BASE_URL}/user/${tokenId}/confirm-verification/${encodeURIComponent(token)}`,
        address: 'Sample Company, Sample Place, Sample Country',
      },
    };
    await mailService.sendMail(msgPayload);

    return res.status(201).json({ status: true, message: 'Kindly check your email for further instructions' });
  } catch (err) {
    return next(err);
  }
}

// create get code-verification and new jwt token creation
async function signin_codeVerification_post(req, res, next) {
  const { code, email } = req.body;

  try {
    // Find the user
    const filter = {
      isVerified: true,
      email,
    };

    const userData = await userModel.findUser(filter);

    // userData will be null if email doesn't exists
    if (!userData) {
      return res.status(401).json({ status: false, message: 'Invalid user credentials.' });
    }

    const resetCodeHash = userData.resetCode;

    // compare hash for the resetCode
    const isValidCode = await bcrypt.compare(code, resetCodeHash);

    if (isValidCode) {
      const payload = {
        exp: new Date().getTime() + (60 * 15 * 1000),
        userId: userData.id,
      };

      // create  jwt token
      const token = await generateToken(payload);

      return res.status(201).json({ status: true, message: 'Code verification successfull and created token for password reset', token });
    }

    return res.status(401).json({ status: false, message: 'Invalid reset code.' });
  } catch (err) {
    return next(err);
  }
}

// create get email_verification and new jwt token creation
async function signin_emailVerification_get(req, res, next) {
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

    // Delete the email Token
    await emailVerificationModel.deleteToken(emailVerificationId);

    const payload = {
      exp: new Date().getTime() + (60 * 15 * 1000),
      userId,
    };

    // create  jwt token
    const newJwtToken = await generateToken(payload);

    return res.status(201).json({ status: true, message: 'Email verification successfull and created token for password reset', token: newJwtToken });
  } catch (err) {
    return next(err);
  }
}

// create post reset password
async function signin_resetPassword_post(req, res, next) {
  const { newPassword, ReEnteredPassword } = req.body;
  const { userId } = req.payLoad;

  if (!(newPassword && ReEnteredPassword)) {
    return res.status(400).json({ status: false, message: 'Missing parameters' });
  }
  try {
    if (ReEnteredPassword === newPassword) {
      // Hash new Password
      const passwordHash = await bcrypt.hash(newPassword, saltRounds);

      const update = {
        password: passwordHash,
      };

      // update the user
      await userModel.update({ id: userId, filter: update });

      const payLoad = {
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        userId,
      };

      // token for signin
      const token = await generateToken(payLoad);

      return res.status(201).json({ status: true, message: 'Password reset is successful.', token });
    }
    return res.status(400).json({ status: false, message: 'Both password should Match' });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  signin_signin_post,
  signin_signin_get,
  signin_passwordChange_post,
  signin_forgotPassword_post,
  signin_codeVerification_post,
  signin_emailVerification_get,
  signin_resetPassword_post,
};
