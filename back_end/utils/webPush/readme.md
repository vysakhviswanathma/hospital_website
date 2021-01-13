# web push notification
## 1) using web-push and service worker

First fact: push notifications are made of two things:
* Push: the act of sending a notification from a server to an application. 
* Notifications: the actual notification displayed in the status bar of your smartphone or on the browser.

### The Web push notifications flow
The Web push notification is a protocol that implies 4 actors:
* the `User`: that wants to receive the notifications.
* the `Application`: that runs on the user-agent (typically the browser)
* the `Service worker`: that runs on the browser
* the `Push Server`: that sends push messages to the service worker

1) The flow starts when the application asks the user consent to display the notifications.

2)  Once the user accepted to receive the notification the application register a service worker (I’ll explain later what a service worker is).

3)  When the app receives the service worker registration, it can use it to create a push notification subscription. The registration creates, with some other thing, an endpoint to send push messages to.

4) At this point, the application sends the push notification registration to the push server. The push server needs the endpoint of the subscription to send messages to.
5)  When the push server receives the push subscription it saves it.

6)  The push server sends a push message to the endpoint of the subscription, next, the message is received by the service worker, that has a listener to push events.

7)  The service worker displays the notification to the user

8) When the user clicks the notification or the notification actions. the service worker receives the click because it has a listener to the notification click event.
9) When the service worker receives the click, it can do pretty much whatever it wants with the notification and the notification data, like displaying a webpage, call an API, or whatever your imagination suggests you.
Now that you know the flow is time to move on with the real implementation.

## Notifications
### Ask user permission
To send notifications, you need to ask the user permission. Notifications cannot be sent without user consent. The user can:
* Do nothing: `default` the notification won’t be displayed
* Grant: `granted` the notification will be displayed
* Deny: `denied` the notification won’t be displayed

### service worker
Service workers essentially act as proxy servers that sit between web applications, the browser, and the network (when available).
To make it easy we can say a service worker is a JavaScript file that runs in the background of the application in a separate thread. It can “talk” with the application, it must be registered, has no access to the dom, runs only under HTTPS or in localhost for development.



#### register service worker
``` js
const registration = await navigator.serviceWorker.register('./sw.js', { scope: '/' });
```
#### Create the push notification subscription.

``` js
const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
```
to create a push notification subscription you use the method serviceWorker.pushManager.subscribe() (in the above code we use registration instead os service worker because our service worker in registration variable) that takes a parameter that represents the options. the properties of these options are:
1) userVisibleOnly: a boolean indicating that the returned push subscription will only be used for messages whose effect is made visible to the user.
2) applicationServerKey: an ECDSA (Elliptic Curve Digital Signature Algorithm) P-256 public key the push server will use to authenticate your application. 

#### Send the subscription to the server.
To send the subscription to the server there is no standard way, the important things to remember are:
1) The communication between the app and the push server must be secure because the subscription information is what is needed to send the notification. If stolen can be used to send unwanted notifications on behalf of the app.
2) when possible the subscription should be associated with a specific user, to send only relevant notifications.
This could be achieved with a simple fetch or with the Http client of the app when present. The object to send is a PushSubscription. Something like this

``` js
await fetch('/push/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'content-type': 'application/json',
    },
  });
```
    
#### Send the push notification

This is the work of the push server. There are some library and framework that implements a push server, I’m going to show you an example made in JavaScript with NodeJS. The code below uses a library called web-push

first install the web push npm package

``` sh 
$ npm i web-push --save
```
then generate vapidKeys for sending notification by using cmd 
``` sh
$ ./node-modules/.bin/web-push generate-vapid-keys
```
or

``` js
const vapidKeys = webpush.generateVAPIDKeys();
```
In either way you get a public and private key. store the generated keys as environatal variables.

setting the webpush package
``` js
webpush.setVapidDetails('mailto:murshidpc@gmail.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY);
```
Vapid means Voluntary Application Server Identification and is a web standard documented [here](https://tools.ietf.org/html/rfc8292).
The VAPID public key is the one shared with the web app ( the one which sends the notification subscription).

setting a static path for web push notification client side 
``` js
app.use(express.static(path.join(__dirname, './utils/webPush')));
```
there is controller for route /push/subscribe
``` js
exports.send_notification = (req, res) => {
// get push subscriptionObject
  const subscription = req.body;

  // send 201
  res.status(201).json({});
  // payload
  const payload = JSON.stringify({ title: 'test' });

  // console.log(subscription);

  webpush.sendNotification(subscription, payload).catch((error) => {
    console.error(error.stack);
  });
};
```

The method sendNotification accepts two parameters:
1) Subscription: a PushSubscription object, that is the one obtained from the service worker by the method: serviceWorker.pushManager.subscribe() as said earlier.
2) payload: the content of the push notification, that must be a string or a buffer. The example is a simple text, but it could be something more interesting like information about the notification to display or a reference to an API to call, in short, whatever you want to be inside the notification.


#### Receive the pushed notification
``` js
self.addEventListener('push', (event) => {
  const data = event.data.json();
  // console.log('Got push', data);
  self.registration.showNotification(data.title, {
    body: 'Hello, World!',
    icon: 'http://mongoosejs.com/docs/images/mongoose5_62x30_transparent.png',
  });
});

```
In this script, we added a listener to the event push in the service worker. The event is an object of type [PushMessageData](https://developer.mozilla.org/en-US/docs/Web/API/PushMessageData) containing the data sent from the push server and can be accessed as String, Object and some others format using the methods event.data.text(), event.data.json() or blob().
Once you read the data from the notification event you can display the notification. Outside the service worker you called earlier the method: serviceWorkerRegistration.showNotification. Inside the service worker, you use self.registration.showNotification().








