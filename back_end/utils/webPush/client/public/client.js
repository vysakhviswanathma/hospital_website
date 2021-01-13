/* eslint-disable no-console */
const publicVapidKey = 'BO0n-xRN4_TTT_psA_cn5NaC7FrTuaTMdM6LvPXqHhQUumgBrmucF6I6XW5RWbyZKdURtNn8q4W5wE32kwG_8wU';

// Boilerplate borrowed from https://www.npmjs.com/package/web-push#using-vapid-key-for-applicationserverkey
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function run() {
  if (!('serviceWorker' in navigator)) {
    // Service Worker isn't supported on this browser, disable or hide UI.
    return;
  }

  if (!('PushManager' in window)) {
    // Push isn't supported on this browser, disable or hide UI.
    return;
  }

  console.log('Registering service worker...');
  const registration = await navigator.serviceWorker
    .register('/sw.js', { scope: '/' });

  console.log('Getting subscription...');
  const subscription = await registration.pushManager
    .subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });

  console.log('Subscribing...');
  await fetch('/push/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'content-type': 'application/json',
    },
  });
  console.log('Process completed.');
}

// Run the process
run().catch((error) => console.error(error));
