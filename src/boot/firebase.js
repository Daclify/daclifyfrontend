import firebase from "firebase/app";
// import * as firebase from 'firebase';
import "firebase/messaging";

const PublicVapidKey = "BFKQdxLk7iDBu4RXH-P-bIjqN97rl2iOV_7ifcsVtsjW7XCdyd42_QeA0POF0A-jQEiUNmkqH-i8-i7g5EG-0a0";

var firebaseConfig = {
  apiKey: "AIzaSyBAlr_KYOcQdRN3zBwVoeFaWEzk1l8_ubw",
  authDomain: "eosio-c9900.firebaseapp.com",
  databaseURL: "https://eosio-c9900.firebaseio.com",
  projectId: "eosio-c9900",
  storageBucket: "eosio-c9900.appspot.com",
  messagingSenderId: "491083681280",
  appId: "1:491083681280:web:1a83db39b48b66447792e5"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let messaging;
if (firebase.messaging.isSupported()){
  messaging = firebase.messaging();
  messaging.usePublicVapidKey(PublicVapidKey);



  navigator.serviceWorker.register('./statics/service-workers/firebase-messaging-sw.js')
  .then((registration) => {
    messaging.useServiceWorker(registration);
  });

  // Callback fired if Instance ID token is updated.
  messaging.onTokenRefresh(() => {
    messaging.getToken().then((refreshedToken) => {
      console.log('Token refreshed.', refreshedToken);
      // Indicate that the new Instance ID token has not yet been sent to the
      // app server.
      // setTokenSentToServer(false);
      // Send Instance ID token to app server.
      // sendTokenToServer(refreshedToken);
      // ...
    }).catch((err) => {
      console.log('Unable to retrieve refreshed token ', err);
      // showToken('Unable to retrieve refreshed token ', err);
    });
  });
}
else{
  messaging = false;
}


export default ({ Vue }) => {
  // something to do
  Vue.prototype.$messaging = messaging;

};
