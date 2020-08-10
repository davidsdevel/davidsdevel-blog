"use strict";

importScripts("https://www.gstatic.com/firebasejs/6.3.5/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/6.3.5/firebase-messaging.js"); // Your web app's Firebase configuration

var firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: "",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
}; // Initialize Firebase

firebase.initializeApp(firebaseConfig);

var _firebase$messaging = firebase.messaging(),
    setBackgroundMessageHandler = _firebase$messaging.setBackgroundMessageHandler;

setBackgroundMessageHandler(function (payload) {
  var title = payload.title,
      body = payload.body,
      icon = payload.icon,
      click_action = payload.click_action;
  var options = {
    body: body,
    icon: icon,
    click_action: click_action
  };
  return self.registration.showNotifiations(title, options);
});