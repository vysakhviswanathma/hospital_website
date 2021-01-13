const Nexmo = require('nexmo');


// setting the nexmo service

const nexmo = new Nexmo({
  apiKey: process.env.NEXMO_API_KEY,
  apiSecret: process.env.NEXMO_API_SECRET,
});

/**
 * send code via sms using nexmo
 * phonenumber must be in (country-code)(number) format eg: (91)(8606****55)
 * @param {string} phonenumber
 * @param {string} brand
 * @param {number} length
 * @returns {Object} { request_id, status, error_text}
 */
const nexmoVerify = (phonenumber, brand, length) => new Promise((resolve, reject) => {
  nexmo.verify.request(
    {
      number: phonenumber,
      brand,
      code_length: length,
      format: 'json',
    },
    (err, result) => {
      if (err) {
        const error = new Error(err.message);
        reject(error);
      } else {
        const { request_id: requestId, status, error_text: errorText } = result;
        if (status !== '0') {
          const error = new Error(errorText);
          reject(error);
        }

        resolve(requestId);
      }
    },
  );
});


/**
 * verify code recieved in you specified phonenumber
 * @param {string} reqId
 * @param {string} code
 * @returns {Object} { request_id, status, error_text}
 */
const nexmoCheck = async (reqId, code) => new Promise((resolve, reject) => {
  nexmo.verify.check(
    {
      code,
      request_id: reqId,
      format: 'json',
    },
    (err, result) => {
      if (err) {
        const error = new Error(err.message);
        reject(error);
      } else {
        if (result) {
          const { status } = result;

          if (status !== '0') {
            const error = new Error('Invalid pin. You may have entered a wrong pin or your pin expired.');
            reject(error);
          }
          resolve(true);
        }
        const error = new Error('Invalid pin. You may have entered a wrong pin or your pin expired.');
        reject(error);
      }
    },
  );
});


/**
 * cancel request the verification request
 * @param {string} reqId
 * @returns {Object} { request_id, command, error_text}
 */
const nexmoCancel = async (reqId) => new Promise((resolve, reject) => {
  nexmo.verify.control(
    {
      request_id: reqId,
      cmd: 'cancel',
      format: 'json',
    },
    (err, result) => {
      if (err) {
        const error = new Error(err.message);
        reject(error);
      } else {
        if (result) {
          const { status } = result;
          if (status !== '0') {
            const error = new Error('Invalid requestID.');
            reject(error);
          }
          resolve(true);
        }
        const error = new Error('Invalid requestID.');
        reject(error);
      }
    },
  );
});

module.exports = {
  nexmoVerify,
  nexmoCheck,
  nexmoCancel,
};
