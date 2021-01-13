const axios = require('axios');
const queryString = require('query-string');

const { FACEBOOK_OAUTH_CLIENT_ID, FACEBOOK_OAUTH_CLIENT_SECRET } = process.env;

/**
 * Request Access token from Facebook
 * @param {string} code
 * @param {string} redirectUri
 * @returns {Object} { access_token, expires_in, token_type, auth_type }
 */
async function getAccessTokenFromCode(code, redirectUri) {
  const { data } = await axios({
    url: 'https://graph.facebook.com/v4.0/oauth/access_token',
    method: 'get',
    params: {
      client_id: FACEBOOK_OAUTH_CLIENT_ID,
      client_secret: FACEBOOK_OAUTH_CLIENT_SECRET,
      redirect_uri: redirectUri,
      code,
    },
  });

  return data;
}

/**
 * Request User Info from Facebook
 * @param {*} accessToken
 * @returns {object} { id, email, first_name, last_name }
 */
async function getUserInfoByAccessToken(accessToken) {
  const { data } = await axios({
    url: 'https://graph.facebook.com/me',
    method: 'get',
    params: {
      fields: ['id', 'email', 'first_name', 'last_name'].join(','),
      access_token: accessToken,
    },
  });

  return data;
}

/**
 * Request Access Token using code and Get User Info using Access Token
 * @param {string} code
 * @param {string} redirectUri
 * @returns {object} { id, email, first_name, last_name }
 */
async function getUserInfo(code, redirectUri) {
  // Get Access Token
  const { access_token: accessToken } = await getAccessTokenFromCode(code, redirectUri);

  // Get User Info
  const data = await getUserInfoByAccessToken(accessToken);

  return data;
}

/**
 * Create Facebook Login URI
 * @param {string} redirectUri
 * @returns {string} facebookLoginUri
 */
function getFacebookLoginUri(redirectUri) {
  const stringifiedParams = queryString.stringify({
    client_id: FACEBOOK_OAUTH_CLIENT_ID,
    redirect_uri: redirectUri,
    scope: 'email', // comma seperated string
    response_type: 'code',
    auth_type: 'rerequest',
    display: 'popup',
  });

  const facebookLoginUri = `https://www.facebook.com/v4.0/dialog/oauth?${stringifiedParams}`;

  return facebookLoginUri;
}

module.exports = {
  getAccessTokenFromCode,
  getUserInfoByAccessToken,
  getUserInfo,
  getFacebookLoginUri,
};
