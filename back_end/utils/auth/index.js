const jwt = require('./jwt');
const googleOAuth = require('./google');
const facebookOAuth = require('./facebook');
const oktaOAuth = require('./okta');
const oktaValidator = require('./oktaValidator');
const twitterOAuth = require('./twitter');

(() => {
  module.exports = {
    jwt,
    googleOAuth,
    facebookOAuth,
    oktaOAuth,
    oktaValidator,
    twitterOAuth,
  };
})();
