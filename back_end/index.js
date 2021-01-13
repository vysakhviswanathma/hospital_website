const os = require('os');
const app = require('./server');
const { logger } = require('./utils/logger');

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  logger.info(`App is running at ${os.hostname}:${app.get('port')} in ${app.get('env')} mode`);
  logger.info('Press CTRL-C to stop...');
});
