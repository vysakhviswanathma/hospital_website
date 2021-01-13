const redis = require('redis');

const { logger } = require('../logger');

let CronJob;
let cronJobStatus = false;

// Create Redis client
const client = redis.createClient({
  retry_strategy(options) {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      // End reconnecting on a specific error and flush all commands with
      // a individual error
      return new Error('The server refused the connection');
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      // End reconnecting after a specific timeout and flush all commands
      // with a individual error
      return new Error('Retry time exhausted');
    }
    if (options.attempt > 10) {
      // End reconnecting with built in error
      return undefined;
    }
    // reconnect after
    return Math.min(options.attempt * 100, 3000);
  },
});

function initCron(Cron) {
  CronJob = Cron;
  cronJobStatus = true;
}

// Initialise CronJob on Redis connection successful
client.on('connect', () => {
  // eslint-disable-next-line global-require
  const { CronJob: Cron } = require('cron-cluster')(client);
  initCron(Cron);
});

// Handle Redid Connection Error
client.on('error', (error) => {
  logger.error(error.toJSON);
  cronJobStatus = false;
});

const addNewSchedule = async (email) => {
  client.lpush('email', email);
};

const jobList = {};

function doCron() {
  return new Promise((resolve, reject) => {
    try {
      if (!cronJobStatus) return reject(new Error('Cron Job can\'nt be initialised.'));
      const job = new CronJob({
        cronTime: '*/2 * * * * *',
        onTick() {
          // Do some stuff here
          logger.info(`running a task every 10 seconds. current process id: ${process.pid}`);
        },
      });
      jobList.email_task = job;
      // logger.log(myJob);
      job.start();
      return resolve(true);
    } catch (err) {
      return reject(err);
    }
  });
}

function stopCron(task) {
  let job;
  switch (task) {
    case 'email':
      job = jobList.email_task;
      break;
    default:
      job = null;
  }

  return new Promise((resolve, reject) => {
    try {
      if (!job) return reject(new Error('specified job is not found in the joblist'));
      job.stop();
      return resolve(true);
    } catch (error) {
      return reject(error);
    }
  });
}


module.exports = {
  doCron,
  addNewSchedule,
  stopCron,
};
