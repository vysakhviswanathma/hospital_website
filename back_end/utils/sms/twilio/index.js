const { authToken, accountSID, serviceID } = process.env;

// setting the twilio service
const client = require('twilio')(accountSID, authToken);

/**
 * send code via sms using twilio
 * phonenumber must be in (country-code)(number) format eg: (91)(8606****55)
 * channel parameter should be either sms or call
 * @param {string} phonenumber
 * @param {string} channel
 * @returns {Object} { sid, service_sid, status}
 */
const twilioVerify = async (phonenumber, channel) => {
  const data = await client.verify.services(serviceID).verifications.create({
    to: `+${phonenumber}`,
    channel,
  });
  return data;
};

/**
 * verify code recieved in your phonenumber
 * phonenumber must be in (country-code)(number) format eg: (91)(8606****55)
 * @param {string} phonenumber
 * @param {string} code
 * @returns {Object} { sid, service_sid, status}
 */

const twilioCheck = async (phonenumber, code) => {
  const data = await client.verify.services(serviceID).verificationChecks.create({
    to: `+${phonenumber}`,
    code,
  });
  return data;
};

module.exports = {
  twilioVerify,
  twilioCheck,
};
