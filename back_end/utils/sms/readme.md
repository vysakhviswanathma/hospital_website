# 2 factor authentication (Verify API)
### 1) Twilio
### 2) Nexmo(Vonage)


The Verify API helps you to implement 2FA (two-factor authentication) in your applications. This is useful for:
  - Protecting against spam, by preventing spammers from creating multiple accounts
  - Monitoring suspicious activity, by forcing an account user to verify ownership of a number
  - Ensuring that you can reach your users at any time because you have their correct phone number.

You can decide which one service is better for your project by checking the countries they are supported and also pricing. if you wanted to know more about twilio vs nexmo, check this [LINK](https://steelkiwi.com/blog/twilio-vs-nexmo/).
For more information about the services you can visit their website
    1)  [Twilio](https://twilio.com)
    2)  [Nexmo](https://www.vonage.com/)

## Introduction
Here we using 2 services twilio and nexmo for 2 factor authentication. First you need to import the module according to your need.
```  js
     const {twilio, nexmo} = require(`<path>`); 
```



### Twilio

 First thing you need to do after selecting twilio is create an account and store the authToken, accountSID and serviceID in your environmental variables.
 authToken, accountSID can copy from your twilio console and serviceID from you Verify service console after creating a new verify service.

 install twilio npm package to the project folder
 
 ```sh
 $ npm i twilio --save 
 ```
 
 ```js
 const { authToken, accountSID, serviceID } = process.env;
 ```


Here in twilio for 2 factor authentication we use 2 functions.
* twilioVerify.
* twilioCheck

twilioVerify is used to send verification code to the registered number via voice or sms.The function accept 2 parameters
* phoneNumber 
* channel

phoneNumber must contain the country code and channel must be sms or voice. 

```js
const twilioVerify = async (phonenumber, channel) => {
  const data = await client.verify.services(serviceID).verifications.create({
    to: `+${phonenumber}`,
    channel,
  });
  return data;
};
```
This will send a token to the end user through the specified channel. Newly created verifications will show a status of pending. Supported channels are sms, call, and email.
    These are the available input parameters for creating a Service.
| Parmeter | required | type |description |
| :---         |     :---:      |      :---:      |     :---: |
| friendlyName   | yes |string    | A descriptive string that you create to describe the verification service. It can be up to 64 characters long. This value should not contain PII.    |
|codeLength     | optional |integer     | The length of the verification code to generate. Must be an integer value between 4 and 10, inclusive.     |
|   lookupEnabled |  optional  |  boolean    |Whether to perform a lookup with each verification started and return info about the phone number.|
|    skipSmsToLandlines         |   optional             |   boolean|Whether to skip sending SMS verifications to landlines. Requires lookup_enabled|
|     dtmfInputRequired        |   optional |       boolean |     Whether to ask the user to press a number before delivering the verify code in a phone call. |
|       ttsName      |     optional           |      string|  The name of an alternative text-to-speech service to use in phone calls. Applies only to TTS languages.    |
|psd2Enabled| optional|boolean|Whether to pass PSD2 transaction parameters when starting a verification|
|doNotShareWarningEnabled|optional|boolean|Whether to add a security warning at the end of an SMS verification body. Disabled by default and applies only to SMS. Example SMS body: Your AppName verification code is: 1234. Don’t share this code with anyone; our employees will never ask for the code|
|customCodeEnabled|optional|boolean|Whether to allow sending verifications with a custom code instead of a randomly generated one. Not available for all customers.|


```json
{
  "sid": "VEXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "service_sid": "VAXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "account_sid": "ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "to": "+15017122661",
  "channel": "sms",
  "status": "pending",
  "valid": false,
  "date_created": "2015-07-30T20:00:00Z",
  "date_updated": "2015-07-30T20:00:00Z",
  "lookup": {
    "carrier": {
      "error_code": null,
      "name": "Carrier Name",
      "mobile_country_code": "310",
      "mobile_network_code": "150",
      "type": "mobile"
    }
  },
  "amount": null,
  "payee": null,
  "send_code_attempts": [
    {
      "time": "2015-07-30T20:00:00Z",
      "channel": "SMS",
      "channel_id": null
    }
  ],
  "url": "https://verify.twilio.com/v2/Services/VAXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Verifications/VEXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
}
```
The Verification Check Resource represents a verification validation. This will check whether the user-provided token is correct

```js
const twilioCheck = async (phonenumber, code) => {
  const data = await client.verify.services(serviceID).verificationChecks.create({
    to: `+${phonenumber}`,
    code,
  });
  return data;
};
```
twilioCheck is used to  verify the code  recieved to the registered number via voice or sms.The function accept 2 parameters
* phoneNumber 
* code

These are the available input parameters for checking a verification.
| Parmeter | required | type |description |
| :---         |     :---:      |      :---:      |     :---: |
|serviceSid|optional|SID<VA>|The SID of the verification Service to create the resource under.|
|code|Yes|string|The 4-10 character string being verified.|
|to|optional|string|The phone number or email to verify. Either this parameter or the verification_sid must be specified. Phone numbers must be in E.164 format.|
|verificationSid|optional|SID<VE>|A SID that uniquely identifies the Verification Check. Either this parameter or the to phone number/email must be specified.|
|amount|optional| string|The amount of the associated PSD2 compliant transaction. Requires the PSD2 Service flag enabled.|
|payee|optional|string|The payee of the associated PSD2 compliant transaction. Requires the PSD2 Service flag enabled.|
phoneNumber must contain the country code. code is in between 4-10 digit. customize the code length at time of creating verification token.you can do it on your twilio service console or add codelength parameter to your create function
the response body:

``` json
{
    "sid": "VEb703129975dcd0e89b1e21c3834b97ed",
    "serviceSid": "VA033649f31c8bc8e104b5aead0d7207b3",
    "accountSid": "AC021c9a00c8d7d61ac0b90b9ff9a9d08f",
    "to": "+918606****56",
    "channel": "sms",
    "status": "approved",
    "valid": true,
    "amount": null,
    "payee": null,
    "dateCreated": "2020-06-12T05:26:48.000Z",
    "dateUpdated": "2020-06-12T05:27:43.000Z"
}
```
if status key in your response body is approved, then your verification is successfull.
for more information about the return-and-error-codes,  check this [LINK](https://www.twilio.com/docs/verify/api/v1/return-and-error-codes)

### Nexmo

The Verify API lets you send a PIN to a user's phone and validate that they received it. Verify can be used for a number of authentication and anti-fraud purposes, such as 2-factor authentication, password-less sign-in, and validating users phone numbers
first you need to create a nexmo(vonage) account and copy the NEXMO_API_KEY and NEXMO_API_SECRET ffrom nexmo console and store in the environmental variables.

```sh
$ npm i nexmo --save
```

after getting the keys, create a new instance of nexmo with the help of nexmo npm package

``` js
const nexmo = new Nexmo({
  apiKey: process.env.NEXMO_API_KEY,
  apiSecret: process.env.NEXMO_API_SECRET,
});
```
in this module, we used 3 functions,
* nexmoVerify
* nexmoCheck
* nexmoCancel

##### nexmoVerify
1) Create a request to send a verification code to your user
```js
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
```
nexmo still using callback in their verify API, so we wrap the code inside a promise. In the request function contain 4 input parameter, user mobile number, brand means the application name, code length(4 or 6) and settitng the response format.
    more information about the input parameter check this [LINK](https://developer.nexmo.com/api/verify#verify-request)
 ``` json
 {
  "request_id": "abcdef0123456789abcdef0123456789",
  "status": "0"
}
 ```
 in case of error
 ``` json
 {
  "request_id": "",
  "status": "2",
  "error_text": "Your request is incomplete and missing the mandatory parameter `number`"
}
 ```
 2) Check the status field in the response to ensure that your request was successful (zero is success).
 3) Use the request_id field in the response for the Verify check.
 
##### nexmoCheck
Use Verify check to confirm that the PIN you received from your user matches the one sent by Nexmo in your Verify request.
1) Send the verification code that your user supplied, with the corresponding request_id from the Verify request.

```js
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
```
we passed the request id and code to this function as input parameter

2) Check the status of the response to determine if the code the user supplied matches the one sent by Nexmo.

``` json
{
  "request_id": "abcdef0123456789abcdef0123456789",
  "event_id": "0A00000012345678",
  "status": "0",
  "price": "0.10000000",
  "currency": "EUR",
  "estimated_price_messages_sent": "0.03330000"
}
```
if the status is zero, that means our code is verified successfully. In case of error
``` json
{
  "request_id": "abcdef0123456789abcdef0123456789",
  "status": "16",
  "error_text": "The code inserted does not match the expected value"
}
```

##### nexmoCancel

Control the progress of your Verify requests. To cancel an existing Verify request, or to trigger the next verification event:
1) Send a Verify control request with the appropriate command (cmd) for what you want to achieve.
``` js
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
```
 the cmd parameter in the nexmo control method must be one of cancel or trigger_next_event.Cancellation is only possible 30 seconds after the start of the verification request and before the second event (either TTS or SMS) has taken place.
 
 2) Check the status in the response.
``` json
{
  "status": "0",
  "command": "cancel"
}
```
in case of error

```json
{
  "status": "6",
  "error_text": "The requestId 'abcdef0123456789abcdef' does not exist or its no longer active."
}
```
if status is zero means the verification request is successfully canceled.
check out nexmo official developer page for more information.[LINK](https://developer.nexmo.com/api/verify#verify-request)









