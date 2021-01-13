const mailgun = require('./mailgun');
const nodemailer = require('./nodemailer');
const peipost = require('./pepipost');
const sendGrid = require('./sendGrid');

const initService = (serviceName) => {
  let mailService;
  switch (serviceName) {
    case 'mailgun':
      mailService = mailgun;
      break;
    case 'nodemailer':
      mailService = nodemailer;
      break;
    case 'pepipost':
      mailService = peipost;
      break;
    default:
      mailService = sendGrid;
  }
  return {
    sendMail: mailService.sendMail,
  };
};

module.exports = initService;
