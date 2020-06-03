importScripts("https://www.gstatic.com/firebasejs/6.3.5/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/6.3.5/firebase-messaging.js");

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

messaging.setBackgroundMessageHandler(function(payload) {
	const {title} = payload;
	const options = {
		body:  payload.body,
		icon:  payload.icon,
		click_action:  payload.click_action
	};

	return self.registration.showNotifiations(title, options);
});
