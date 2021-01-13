const winston = require('winston');

// Logger configuration
const logConfiguration = {
  transports: [
    new winston.transports.Console(),
  ],
};

// Create the logger
const logger = winston.createLogger(logConfiguration);

module.exports = {
  logger,
};
