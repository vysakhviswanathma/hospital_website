const OktaJwtVerifier = require('@okta/jwt-verifier');

const { OKTA_AUTH_SERVER_ISSUER, OKTA_AUTH_SERVER_EXPECTED_AUD } = process.env;

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: OKTA_AUTH_SERVER_ISSUER, // required
});

// authenticate JWT Token Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const match = authHeader.match(/Bearer (.+)/);

  if (!match) {
    res.status(401).send('Bearer token not present in Authorization Header');
  }

  const accessToken = match[1];

  return oktaJwtVerifier.verifyAccessToken(accessToken, OKTA_AUTH_SERVER_EXPECTED_AUD)
    .then((jwt) => {
      req.jwt = jwt;

      return next();
    })
    .catch((err) => res.status(401).send(`Token validation failed, current token is: ${JSON.stringify(accessToken)} ${err.toString()}`));
};

module.exports = {
  authenticateToken,
};
