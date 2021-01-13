const axios = require('axios');
const fs = require('fs');
const path = require('path');

// import required templates
const { renderTemplate } = require('../templates');

const msg = {
  from: { email: 'jsdalpg5@pepisandbox.com', name: 'JS Team' },
  subject: '',
  content: [
    {
      type: 'html',
      value: '',
    },
  ],
  attachments: [],
  personalizations: [
    {
      to: [{ email: '' }],
    },
  ],

};

const sendMail = async (msgPayload) => {
  const {
    to, subject, template, templateData, pathToAttachment,
  } = msgPayload;

  const rendered = await renderTemplate(template, templateData);

  msg.subject = subject;
  msg.content[0].value = rendered;
  msg.personalizations[0].to[0].email = to;

  if (pathToAttachment) {
    // read the pdf file
    const attachment = fs.readFileSync(pathToAttachment).toString('base64');
    const name = path.basename(pathToAttachment);
    const attachmentPayload = {
      content: attachment,
      name,
    };
    msg.attachments.push(attachmentPayload);
  }

  const { data } = await axios({
    url: 'https://api.pepipost.com/v5/mail/send',
    method: 'post',
    headers: {
      api_key: `${process.env.PEPIPOST_API_KEY}`,
      'content-type': 'application/json',
    },
    data: msg,
  });

  // eslint-disable-next-line no-else-return
  if (data && data.status === 'success') { return true; } else { return false; }
};

module.exports = {
  sendMail,
};
