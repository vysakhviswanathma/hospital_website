const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const mime = require('mime');

// import required templates
const { renderTemplate } = require('../templates');

// create your own smtp mail server. here i am using gmail
// as my transport(allow less secure app access)
const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'js@techversantinfo.com',
    pass: 'javascriptlog123',
  },
});

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

  msg.to = to;
  msg.subject = subject;
  msg.html = rendered;
  if (pathToAttachment) {
    // read the pdf file
    const attachment = fs.readFileSync(pathToAttachment).toString('base64');
    const filename = path.basename(pathToAttachment);
    const contentType = mime.getType(pathToAttachment);
    const attachmentPayload = {
      content: attachment,
      filename,
      contentType,
    };
    msg.attachments.push(attachmentPayload);
  }

  await transport.sendMail(msg);
  return true;
};

module.exports = {
  sendMail,
};
