const axios = require('axios');
const queryString = require('query-string');

const { OKTA_CLIENT_ID, OKTA_CLIENT_SECRET, OKTA_AUTH_SERVER_ISSUER } = process.env;

/**
 * Request Access and ID token from Okta
 * @param {string} code
 * @param {string} redirectUri
 * @returns {Object} {token_type, expires_in, access_token, scope, id_token}
 */
async function getAccessTokenFromCode(code, redirectUri) {
  const authData = `${OKTA_CLIENT_ID}:${OKTA_CLIENT_SECRET}`;
  const buff = Buffer.from(authData);
  const base64authData = buff.toString('base64');

  const { data } = await axios({
    url: `${OKTA_AUTH_SERVER_ISSUER}/v1/token`,
    method: 'post',
    params: {
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
      code,
    },
    headers: {
      accept: 'application/json',
      authorization: `Basic ${base64authData}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return data;
}

/**
 * Create Okta Login URI
 * @param {string} redirectUri
 * @returns {string} oktaLoginUri
 */
function getOktaLoginUri(redirectUri) {
  const stringifiedParams = queryString.stringify({
    client_id: OKTA_CLIENT_ID,
    redirect_uri: redirectUri,
    scope: [
      'openid',
      'profile',
    ].join(' '), // space seperated string,
    response_type: 'code',
    state: 'state-296bc9a0-a2a2-4a57-be1a-d0e2fd9bb601',
  });

  const googleLoginUri = `${OKTA_AUTH_SERVER_ISSUER}/v1/authorize?${stringifiedParams}`;

  return googleLoginUri;
}

module.exports = {
  getAccessTokenFromCode,
  getOktaLoginUri,
};
