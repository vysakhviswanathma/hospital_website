const mongoose = require('mongoose');
const { logger } = require('../utils/logger');

// Require schema models
const user = require('./schemas/user.js');
const emailVerification = require('./schemas/emailVerification.js');
const notificationSubscription = require('./schemas/notificationSubscription');

mongoose.set('useFindAndModify', false);

// Connect to the database
// construct the database URI and encode username and password.
const dbURI = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}`;

const dbOptions = {
  user: encodeURIComponent(process.env.DB_USERNAME),
  pass: encodeURIComponent(process.env.DB_PASSWORD),
  dbName: process.env.DB_DATABASE_NAME,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(dbURI, dbOptions)
  .catch((err) => {
    logger.error(err.message);
  });

// Throw an error if the connection fails
mongoose.connection.on('error', (err) => {
  // if(err) throw err;
  // throw err;
  logger.error(err.message);
});

// mpromise (mongoose's default promise library) is deprecated,
// Plug-in your own promise library instead.
// Use native promises
mongoose.Promise = global.Promise;

module.exports = {
  mongoose,
  models: {
    user,
    emailVerification,
    notificationSubscription,
  },
};
