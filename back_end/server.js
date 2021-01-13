/**
 * Module dependencies.
 */
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
const compression = require('compression');
const path = require('path');
const session = require('express-session');

// Load environment variables
dotenv.config();

// Error Handlers
const { notFoundHandler, defaultErrorHandler } = require('./utils/errorHandler');
// web push utility
const webPush = require('./utils/webPush');

// Import Routes
const routes = require('./routes');

/**
 * Create Express server.
 */
const app = express();

/**
 * Express configuration.
 */
app.set('host', process.env.HOST);
app.set('port', process.env.PORT);

/**
 * The default server-side session storage, MemoryStore, is purposely not
 * designed for a production environment. It will leak memory under most
 * conditions, does not scale past a single process, and is meant for
 * debugging and developing.
 */
app.use(session({ secret: 'very secret', resave: false }));

/**
 * IMPORTANT: For a high-traffic website in production, the best way to put
 * compression in place is to implement it at a reverse proxy level.
 * In that case, you do not need to use this compression middleware.
 */
app.use(compression());

app.use(logger(process.env.LOG_LEVEL));

// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files for Web-Push
const webpushPublicFiles = path.join(__dirname, './utils/webPush/client/public');
app.use(express.static(webpushPublicFiles));

// Configure Web-Push
webPush.configure('mailto:js@techversantinfo.com');

// Route
app.use('/', routes);

// Mount 404 handler as penultimate middleware
app.use(notFoundHandler);

// Mount catch-all error handler
app.use(defaultErrorHandler);

module.exports = app;
