/* eslint-disable camelcase */
const { twilio, nexmo } = require('../utils/sms');

const { twilioVerify, twilioCheck } = twilio;

const { nexmoVerify, nexmoCheck, nexmoCancel } = nexmo;


// send code via sms using twilio verify service
const twilio_login = async (req, res) => {
  const { phoneNumber, channel } = req.params;

  try {
    const data = await twilioVerify(phoneNumber, channel);
    if (data) {
      return res.status(201).json({ status: true, message: `sms send to your mobible number ${phoneNumber}`, data });
    }
    return res.status(400).json({ status: false, message: 'failed' });
  } catch (error) {
    return error;
  }
};


// code  verification using twilio
const twilio_verify = async (req, res) => {
  const { phoneNumber, code } = req.params;
  try {
    const data = await twilioCheck(phoneNumber, code);
    if (data) {
      return res.status(201).json({ status: true, message: `sms send to your mobible number ${phoneNumber}`, data });
    }
    return res.status(401).json({ status: false, message: 'failed' });
  } catch (error) {
    return error;
  }
};

// send code via sms using nexmo(Vonage) verify service
const nexmo_verify = async (req, res) => {
  const { phoneNumber, codeLength } = req.body;
  try {
    const data = await nexmoVerify(phoneNumber, process.env.NEXMO_BRAND_NAME, codeLength);
    if (data) {
      return res.status(201).json({ status: true, message: `sms send to your mobible number ${phoneNumber}`, requestID: data });
    }
    return res.status(401).json({ status: false, message: 'verification failed' });
  } catch (error) {
    return error;
  }
};

// cancel verification request(nexmo)
const nexmo_cancel = async (req, res) => {
  const { reqID } = req.body;
  try {
    const data = await nexmoCancel(reqID);
    if (data) {
      return res.status(201).json({ status: true, message: 'request canceled successfully', data });
    }
    return res.status(401).json({ status: false, message: 'failed' });
  } catch (error) {
    return error;
  }
};

// code verification using nexmo(Vonage)
const nexmo_check = async (req, res) => {
  const { reqID, code } = req.body;
  try {
    const data = await nexmoCheck(reqID, code);
    if (data) {
      return res.status(201).json({ status: true, message: 'account verification succesfull' });
    }
    return res.status(401).json({ status: false, message: 'verification failed' });
  } catch (error) {
    return error;
  }
};

// GET secure-resource
const test_secureResource_get = (req, res) => res.status(200).json({ status: true, message: 'Validations passed. Test successfull.' });

module.exports = {
  twilio_login,
  twilio_verify,
  nexmo_verify,
  nexmo_check,
  nexmo_cancel,
  test_secureResource_get,
};
