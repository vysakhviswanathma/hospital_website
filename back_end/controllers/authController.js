/* eslint-disable camelcase */
const {
  googleOAuth, facebookOAuth, oktaOAuth, jwt, twitterOAuth,
} = require('../utils/auth');

const { generateToken } = jwt;
const userModel = require('../models/user');

// Create get auth/google/callback
async function auth_google_get(req, res, next) {
  const { query } = req;
  const { code, error } = query;

  if (!code) {
    return next(error);
  }

  try {
    // Redirect URI for Google OAuth
    const redirectUri = `${process.env.BASE_URL}/api/auth/google/callback`;

    // Get the User Info
    const userInfo = await googleOAuth.getUserInfo(code, redirectUri);
    const { email, given_name: fullName } = userInfo;

    // Check for a user with the email id provided
    let userData = await userModel.findUser({ email });

    if (!userData) {
      const fullNameArray = fullName.split(' ');

      const firstName = fullNameArray[0];
      const lastName = fullNameArray[fullNameArray.length - 1];

      const user = {
        firstName,
        lastName,
        email,
        isVerified: true,
        password: '',
      };

      // Save user data to db
      userData = await userModel.createUser(user);
    }

    // Set userId
    const { id: userId } = userData;

    // Create JWT Token
    const payLoad = {
      exp: Math.floor(Date.now() / 1000) + (60 * 60),
      userId,
    };

    const token = await generateToken(payLoad);

    return res.status(201).json({ status: true, message: 'User signin successfull', token });
  } catch (err) {
    return next(err);
  }
}

// Create get auth/facebook/callback
async function auth_facebook_get(req, res, next) {
  const { query } = req;
  const { code, error } = query;

  if (!code) {
    return next(error);
  }

  try {
    // Redirect URI for Facebook OAuth
    const redirectUri = `${process.env.BASE_URL}/api/auth/facebook/callback`;

    // Get the User Info
    const userInfo = await facebookOAuth.getUserInfo(code, redirectUri);

    const { email, first_name: firstName, last_name: lastName } = userInfo;

    // Check for a user with the email id provided
    let userData = await userModel.findUser({ email });

    if (!userData) {
      const user = {
        firstName,
        lastName,
        email,
        isVerified: true,
        password: '',
      };

      // Save user data to db
      userData = await userModel.createUser(user);
    }

    // Set userId
    const { id: userId } = userData;

    // Create JWT Token
    const payLoad = {
      exp: Math.floor(Date.now() / 1000) + (60 * 60),
      userId,
    };

    const token = await generateToken(payLoad);

    return res.status(201).json({ status: true, message: 'User signin successfull', token });
  } catch (err) {
    return next(err);
  }
}

// Create get auth/okta/callback
async function auth_okta_get(req, res, next) {
  /**
   * Important: This Okta Auth control is desighned for the demo purpose only.
   * Usually, all these auth flow upto the token generation for okta will be
   * performed by the client application. Okta is already having the SDK for that.
   */
  const { query } = req;
  const { code, error } = query;

  if (!code) {
    return next(error);
  }

  try {
    // Redirect URI for Okta OAuth
    const redirectUri = `${process.env.BASE_URL}/api/auth/okta/callback`;

    // Get the User Info
    const userData = await oktaOAuth.getAccessTokenFromCode(code, redirectUri);

    return res.status(201).json({ status: true, message: 'User signin successfull', userData });
  } catch (err) {
    return next(err);
  }
}

// Create get auth/twitter/signin
async function auth_twitterSignin_get(req, res, next) {
  try {
    // Redirect URI for Twitter OAuth
    const {
      redirectUri: twitterRedirectUri, oauthToken, oauthTokenSecret,
    } = await twitterOAuth.getRedirectUri();

    req.session.oauthRequestToken = oauthToken;
    req.session.oauthRequestTokenSecret = oauthTokenSecret;

    return res.redirect(302, twitterRedirectUri);
  } catch (err) {
    return next(err);
  }
}

// Create get auth/twitter/callback
async function auth_twitter_get(req, res, next) {
  const { query } = req;
  const { oauth_token, oauth_verifier } = query;

  if (!oauth_token && !oauth_verifier) {
    return res.status(400).json({ status: false, message: 'Missing parameters' });
  }

  try {
    const responce = await twitterOAuth.getAccessToken(
      req.session.oauthRequestToken,
      req.session.oauthRequestTokenSecret,
      oauth_verifier,
    );

    const { oauthAccessToken, oauthAccessTokenSecret } = responce;

    req.session.oauthAccessToken = oauthAccessToken;
    req.session.oauthAccessTokenSecret = oauthAccessTokenSecret;

    await twitterOAuth.verifyCredentials(oauthAccessToken, oauthAccessTokenSecret);

    // Get the User Info
    // const userInfo = await facebookOAuth.getUserInfo(code, redirectUri);

    // const { email, first_name: firstName, last_name: lastName } = userInfo;

    // Check for a user with the email id provided
    // let userData = await userModel.findUser({ email });

    // if (!userData) {
    //   const user = {
    //     firstName,
    //     lastName,
    //     email,
    //     isVerified: true,
    //     password: '',
    //   };

    //   // Save user data to db
    //   userData = await userModel.createUser(user);
    // }

    // Set userId
    // const { id: userId } = userData;

    // Create JWT Token
    const payLoad = {
      exp: Math.floor(Date.now() / 1000) + (60 * 60),
      // userId,
    };

    const token = await generateToken(payLoad);

    return res.status(201).json({ status: true, message: 'User signin successfull', token });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  auth_google_get,
  auth_facebook_get,
  auth_okta_get,
  auth_twitterSignin_get,
  auth_twitter_get,
};
