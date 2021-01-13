const { logger } = require('../logger');

const notFoundHandler = (req, res) => {
  logger.warn(
    'Unhandled resource',
    {
      statusCode: 404,
      error: 'Unknown resource',
      resource: req.originalUrl,
    },
  );

  return res
    .status(404)
    .send(`${req.originalUrl} not found on this server.`);
};

// eslint-disable-next-line no-unused-vars
const defaultErrorHandler = (err, req, res, next) => {
  logger.error('Uncaught error', { statusCode: 500, err: err.stack });

  return res
    .status(500)
    .send(err.toString());
};

module.exports = {
  notFoundHandler,
  defaultErrorHandler,
};
