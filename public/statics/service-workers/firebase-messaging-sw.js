importScripts('https://www.gstatic.com/firebasejs/6.3.4/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/6.3.4/firebase-messaging.js');

firebase.initializeApp({'messagingSenderId': '491083681280'});

const messaging = firebase.messaging();


// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// [START background_handler]
messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };


  // if (event.clientId){
  //   // Get the client.
  //   const client = await clients.get(event.clientId);
  //   // Exit early if we don't get the client.
  //   // Eg, if it closed.
  //   if (!client) return;

  //   // Send a message to the client.
  //   client.postMessage({
  //     msg: "Hey I just got a fetch from you!",
  //   });

  // }





  return self.registration.showNotification(notificationTitle,
    notificationOptions);
});
// [END background_handler]
