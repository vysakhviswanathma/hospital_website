// eslint-disable-next-line camelcase
const api_key = process.env.MAILGUN_API_KEY;
const domain = process.env.MAILGUN_DOMAIN;
const fs = require('fs');
const path = require('path');
const mime = require('mime');


const mailgun = require('mailgun-js')({ apiKey: api_key, domain });

// import required templates
const { renderTemplate } = require('../templates');

const msg = {
  to: '',
  from: 'js@techversantinfo.com',
  subject: '',
  html: '',
};

const sendMail = async (msgPayload) => {
  const {
    to, subject, template, templateData, pathToAttachment,
  } = msgPayload;
  const rendered = await renderTemplate(template, templateData);

  msg.to = to;
  msg.subject = subject;
  msg.html = rendered;

  if (pathToAttachment) {
    // read the pdf file
    const attachment = fs.createReadStream(pathToAttachment);
    const filename = path.basename(pathToAttachment);
    const fileStat = fs.statSync(pathToAttachment);
    const contentType = mime.getType(pathToAttachment);

    msg.attachment = new mailgun.Attachment({
      data: attachment,
      filename,
      knownLength: fileStat.size,
      contentType,
    });
  }

  await mailgun.messages().send(msg);
  return true;
};

module.exports = {
  sendMail,
};
