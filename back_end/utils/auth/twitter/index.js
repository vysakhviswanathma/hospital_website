const oauth = require('oauth');

const { TWITTER_API_KEY, TWITTER_API_SECRET_KEY } = process.env;

// Redirect URI for Twitter OAuth
const twitterRedirectUri = `${process.env.BASE_URL}/api/auth/twitter/callback`;

const consumer = new oauth.OAuth('https://twitter.com/oauth/request_token', 'https://twitter.com/oauth/access_token', TWITTER_API_KEY, TWITTER_API_SECRET_KEY, '1.0A', twitterRedirectUri, 'HMAC-SHA1');

/**
 * Get Redirect Uri
 * @returns {object} {redirectUri, oauthToken, oauthTokenSecret, results}
 */
function getRedirectUri() {
  return new Promise((resolve, reject) => {
    consumer.getOAuthRequestToken((error, oauthToken, oauthTokenSecret, results) => {
      if (error) {
        reject(error);
      } else {
        const data = {
          redirectUri: `https://twitter.com/oauth/authorize?oauth_token=${oauthToken}`,
          oauthToken,
          oauthTokenSecret,
          results,
        };
        resolve(data);
      }
    });
  });
}

/**
 * Get Access Token
 * @param {String} oauthRequestToken
 * @param {String} oauthRequestTokenSecret
 * @param {String} oauthVerifier
 * @returns {object} {oauthAccessToken, oauthAccessTokenSecret, results}
 */
function getAccessToken(oauthRequestToken, oauthRequestTokenSecret, oauthVerifier) {
  return new Promise((resolve, reject) => {
    consumer.getOAuthAccessToken(oauthRequestToken, oauthRequestTokenSecret, oauthVerifier,
      (error, oauthAccessToken, oauthAccessTokenSecret, results) => {
        if (error) {
          return reject(error);
        }
        return resolve({ oauthAccessToken, oauthAccessTokenSecret, results });
      });
  });
}

/**
 * Verify Credentials
 * @param {String} oauthAccessToken
 * @param {String} oauthAccessTokenSecret
 * @returns {object} {parsedData}
 */
function verifyCredentials(oauthAccessToken, oauthAccessTokenSecret) {
  return new Promise((resolve, reject) => {
    const verifyUrl = 'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true';
    consumer.get(verifyUrl, oauthAccessToken, oauthAccessTokenSecret, (error, data) => {
      if (error) {
        return reject(error);
      }
      const parsedData = JSON.parse(data);
      return resolve(parsedData);
    });
  });
}

module.exports = {
  getRedirectUri,
  getAccessToken,
  verifyCredentials,
};
