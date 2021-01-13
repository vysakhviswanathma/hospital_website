const sgMail = require('@sendgrid/mail');
const fs = require('fs');
const path = require('path');
const mime = require('mime');

// import required templates
const { renderTemplate } = require('../templates');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: '',
  from: 'js@techversantinfo.com',
  subject: '',
  html: '',
  attachments: [],
};

const sendMail = async (msgPayload) => {
  const {
    to, subject, template, templateData, pathToAttachment,
  } = msgPayload;
  const rendered = await renderTemplate(template, templateData);
  // 'application/pdf';
  msg.to = to;
  msg.subject = subject;
  msg.html = rendered;
  if (pathToAttachment) {
    // read the pdf file
    const attachment = fs.readFileSync(pathToAttachment).toString('base64');
    const filename = path.basename(pathToAttachment);
    const type = mime.getType(pathToAttachment);
    const attachmentPayload = {
      content: attachment,
      filename,
      type,
      disposition: 'attachment',
    };
    msg.attachments.push(attachmentPayload);
  }

  await sgMail.send(msg);
  return true;
};

module.exports = {
  sendMail,
};
