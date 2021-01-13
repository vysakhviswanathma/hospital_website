/* eslint-disable no-else-return */
const jwt = require('jsonwebtoken');

// Generate Token
const generateToken = async (payLoad) => {
  const token = await jwt.sign(payLoad, process.env.JWT_SECRET);
  return token;
};

// authenticate JWT Token Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    return jwt.verify(token, process.env.JWT_SECRET, (err, payLoad) => {
      if (err) {
        return res.sendStatus(403);
      } else {
        req.payLoad = payLoad;
        return next();
      }
    });
  } else {
    return res.sendStatus(401);
  }
};

module.exports = {
  generateToken,
  authenticateToken,
};
