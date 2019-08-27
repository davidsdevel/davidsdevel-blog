// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAzcg06Z-3ukLDhVkvxM7V0lCNwYTwHpho",
  authDomain: "davids-devel-1565378708258.firebaseapp.com",
  databaseURL: "https://davids-devel-1565378708258.firebaseio.com",
  projectId: "davids-devel-1565378708258",
  storageBucket: "",
  messagingSenderId: "167456236988",
  appId: "1:167456236988:web:0896b0297732acc2"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onTokenRefresh(function() {
  messaging.getToken()
  .then(function(refreshedToken) {
    console.log('Token refreshed.');
    // Indicate that the new Instance ID token has not yet been sent to the
    // app server.
    setTokenSentToServer(false);
    // Send Instance ID token to app server.
    sendTokenToServer(refreshedToken);

  }).catch(function(err) {
    console.log('Unable to retrieve refreshed token ', err);
  });
});



messaging.requestPermission()
.then(function() {
  console.log("Auth");
  return messaging.getToken();
})
.then(function(token) {
  if (currentToken) {
    sendTokenToServer(currentToken);
    updateUIForPushEnabled(currentToken);
  } else {
    // Show permission request.
    console.log('No Instance ID token available. Request permission to generate one.');
    // Show permission UI.
    updateUIForPushPermissionRequired();
    setTokenSentToServer(false);
  }
})
.catch(function(err) {
  console.log('An error occurred while retrieving token. ', err);
  setTokenSentToServer(false);
});


// Send the Instance ID token your application server, so that it can:
// - send messages back to this app
// - subscribe/unsubscribe the token from topics
function sendTokenToServer(currentToken) {
  if (!isTokenSentToServer()) {
    console.log('Sending token to server...');
    /**
     * fetch(`http://localhost:3000/fcm/add-token?token=${currentToken}`)
     * .then(function(req) {
     *    return req.json();
     * })
     * .then(function(data) {
     *    if (data.status === "ok") {
     *      console.log("Token Sended");
     *    }
     * })
     * .catch(function(err) {
     *   console.log("Error sending Token to server: ", err);
     * })
     */
    setTokenSentToServer(true);
  } else {
    console.log('Token already sent to server so won\'t send it again ' +
        'unless it changes');
  }
}
function isTokenSentToServer() {
  return localStorage.getItem('sentToServer') === '1';
}
function setTokenSentToServer(sent) {
  localStorage.setItem('sentToServer', sent ? '1' : '0');
}
