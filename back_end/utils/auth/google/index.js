const axios = require('axios');
const queryString = require('query-string');

const { GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET } = process.env;

/**
 * Request Access token from Google
 * @param {string} code
 * @param {string} redirectUri
 * @returns {Object} {access_token, expires_in, token_type, refresh_token}
 */
async function getAccessTokenFromCode(code, redirectUri) {
  const { data } = await axios({
    url: 'https://oauth2.googleapis.com/token',
    method: 'post',
    data: {
      client_id: GOOGLE_OAUTH_CLIENT_ID,
      client_secret: GOOGLE_OAUTH_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
      code,
    },
  });

  return data;
}

/**
 * Request User Info from Google
 * @param {*} accessToken
 * @returns {object} { id, email, email_verified, given_name, family_name }
 */
async function getUserInfoByAccessToken(accessToken) {
  const { data } = await axios({
    url: 'https://www.googleapis.com/oauth2/v2/userinfo',
    method: 'get',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return data;
}

/**
 * Request Access Token using code and Get User Info using Access Token
 * @param {string} code
 * @param {string} redirectUri
 * @returns {object} { id, email, email_verified, given_name, family_name }
 */
async function getUserInfo(code, redirectUri) {
  // Get Access Token
  const { access_token: accessToken } = await getAccessTokenFromCode(code, redirectUri);

  // Get User Info
  const { data } = await axios({
    url: 'https://www.googleapis.com/oauth2/v2/userinfo',
    method: 'get',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return data;
}

/**
 * Create Google Login URI
 * @param {string} redirectUri
 * @returns {string} googleLoginUrl
 */
function getGoogleLoginUri(redirectUri) {
  const stringifiedParams = queryString.stringify({
    client_id: GOOGLE_OAUTH_CLIENT_ID,
    redirect_uri: redirectUri,
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ].join(' '), // space seperated string
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
  });

  const googleLoginUri = `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`;

  return googleLoginUri;
}

module.exports = {
  getAccessTokenFromCode,
  getUserInfoByAccessToken,
  getUserInfo,
  getGoogleLoginUri,
};
