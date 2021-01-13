/* eslint-disable camelcase */
const scheduler = require('../utils/cron-job');

const { doCron, stopCron } = scheduler;

async function cronjob_schedule_get(req, res, next) {
  try {
    await doCron();
    return res.json({ status: true, message: 'Requested to start Cron Job' });
  } catch (err) {
    // return res.json({ status: false, message: err.message });
    return next(err);
  }
}

async function cronjob_stop_get(req, res, next) {
  const { params: reqParams } = req;
  const { job } = reqParams;
  try {
    await stopCron(job);
    return res.json({ status: true, message: 'Requested to stop Cron Job' });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  cronjob_schedule_get,
  cronjob_stop_get,
};
