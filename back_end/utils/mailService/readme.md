# mail services
### 1) sendGrid

Mail services help you to send email to your users securely. here we using sendgrid as our one of the mail service.SendGrid is a great service made by Twilio for sending emails. Rather than setting up your own email server for sending email with your apps, we use SendGrid to do the hard work for us. It also decrease the chance of email ending up in spam since it is a known trustworthy service.

To send emails with SendGrid, install the SendGrid SDK package in your project

``` sh
$ npm i @sendgrid/mail --save
```

then in your code

``` js
const sgMail = require('@sendgrid/mail');
```
after that create a sendgrid account and generate API Key for our project.which should be stored as an environmental variable since it is a secret.

```js
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
```
import htmltemplates from the template folder 

```js
const { renderTemplate } = require('../templates');
```

next step is setting parameters for our mail. it should contains recipient address, from address, subject, and the template

```js
const msg = {
  to: '',
  from: 'js@techversantinfo.com',
  subject: '',
  html: '',
};
```

then we creating an async function for sendin mail

```js
const sendMail = async (msgPayload) => {
  const {
    to, subject, template, templateData,
  } = msgPayload;
  const rendered = await renderTemplate(template, templateData);

  msg.to = to;
  msg.subject = subject;
  msg.html = rendered;

  await sgMail.send(msg);
  return true;
};
```
message payload is a input parameter to this sendMail function. it must contain email addresses of the recipients, subjects, email template and templateData for adding to the template. then set the appropriate template for our mail by using renderTemplate method. then update msg object we created before and pass the object as input parameter to sendgrid send method.

### 2) mailgun
use mailgun, first you need to copy the api key and domain name from your mailgun dashboard and store as your environmental variable.

``` js
const api_key = process.env.MAILGUN_API_KEY;
const domain = process.env.MAILGUN_DOMAIN;
```
To send emails with mailgun, install the mailgun SDK package in your project and create mailgun instance using your api key and domain name.Here we using sandbox domain for testing (authorize your recipient email in your sandbox console before testing )

``` sh
$ npm i mailgun --save
```
``` js
const mailgun = require('mailgun-js')({ apiKey: api_key, domain });
```
import htmltemplates from the template folder 

```js
const { renderTemplate } = require('../templates');
```

next step is setting parameters for our mail. it should contains recipient address, from address, subject, and the template

```js
const msg = {
  to: '',
  from: 'js@techversantinfo.com',
  subject: '',
  html: '',
};
```

then we creating an async function for sendin mail

```js
const sendMail = async (msgPayload) => {
  const {
    to, subject, template, templateData,
  } = msgPayload;
  const rendered = await renderTemplate(template, templateData);

  msg.to = to;
  msg.subject = subject;
  msg.html = rendered;

  await mailgun.messages().send(msg);
  return true;
};
```
message payload is a input parameter to this sendMail function. it must contain email addresses of the recipients, subjects, email template and templateData for adding to the template. then set the appropriate template for our mail by using renderTemplate method. then update msg object we created before and pass the object as input parameter to mailgun send method.

### 3) nodemailer
 Node mailer has simplified such a tedious task of sending emails, with only a few lines of code we can send emails in Node JS.

``` sh
$ npm i nodemailer --save
```
then create a transporter for sending email. here i am using gmail as my transporter you can create your own smtp mail server and add credential to the transporter.if you are using gmail in your transporter, first you need to open  security section of google account and turn on the less secure apps.

``` js
const nodemailer = require('nodemailer');
const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '<email>',
    pass: '<password>',
  },
});
```
import htmltemplates from the template folder 

```js
const { renderTemplate } = require('../templates');
```

next step is setting parameters for our mail. it should contains recipient address, from address, subject, and the template

```js
const msg = {
  to: '',
  from: 'js@techversantinfo.com',
  subject: '',
  html: '',
};
```

then we creating an async function for sendin mail

```js
const sendMail = async (msgPayload) => {
  const {
    to, subject, template, templateData,
  } = msgPayload;
  const rendered = await renderTemplate(template, templateData);

  msg.to = to;
  msg.subject = subject;
  msg.html = rendered;

  await transport.sendMail(msg);;
  return true;
};
```
message payload is a input parameter to this sendMail function. it must contain email addresses of the recipients, subjects, email template and templateData for adding to the template. then set the appropriate template for our mail by using renderTemplate method. then update msg object we created before and pass the object as input parameter to nodemailer send method
### 3) pepipost
Node.js has a built-in module called HTTP, which allows Node.js to transfer data over the Hyper Text Transfer Protocol (HTTP).Here we use http module to send email.To include the HTTP module, use the require() method:

``` js
const http = require('https');
```
to use pepipost as your email service, first you need to copy pepipost Email API key from pepipost console and store as your environmental variable.
 ``` js
 const options = {
  'method': 'POST',
  'hostname': 'api.pepipost.com',
  'port': null,
  'path': '/v5/mail/send',
  'headers': {
    'api_key': `${process.env.PEPIPOST_API_KEY}`,
    'content-type': 'application/json',
  },
};
 ```
 in the options, we specify the http method, hostname and add your api key in to your request header.

``` js
const req = http.request(options, (res) => {
  const chunks = [];

  res.on('data', (chunk) => {
    chunks.push(chunk);
  });

  res.on('end', () => {
    const body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});
```
import htmltemplates from the template folder 

```js
const { renderTemplate } = require('../templates');
```

next step is setting parameters for our mail. it should contains recipient address, from address, subject, and the template

```js
const msg = {
  from: { email: 'jsTeam@pepisandbox.com', name: 'jsTeam' },
  subject: '',
  content: [
    {
      type: 'html',
      value: '',
    },
  ],
  personalizations: [
    {
      to: [{ email: '' }],
    },
  ],

};
```

then we creating an async function for sendin mail

```js
const sendMail = async (msgPayload) => {
  const {
    to, subject, template, templateData,
  } = msgPayload;
  const rendered = await renderTemplate(template, templateData);

  msg.subject = subject;
  msg.content[0].value = rendered;
  msg.personalizations[0].to[0].email = to;

  req.write(JSON.stringify(msg));
  req.end();
};
};
```
message payload is a input parameter to this sendMail function. it must contain email addresses of the recipients, subjects, email template and templateData for adding to the template. then set the appropriate template for our mail by using renderTemplate method. then update msg object we created before and write the  object in to your request.



