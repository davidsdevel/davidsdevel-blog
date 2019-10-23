import firebase from "firebase/app";
import "firebase/messaging";

class Messaging {
	constructor(config) {
		this.config = config;
	}
	async init() {
		console.log("init")
		firebase.initializeApp(this.config);
		const messaging = firebase.messaging();

		messaging.onTokenRefresh(async () => {
			try {
				const refreshedToken = await messaging.getToken();
		    	console.log('Token refreshed.');
		    	this.setTokenSentToServer(false);
		    	// Send Instance ID token to app server.
		    	this.sendTokenToServer(refreshedToken);
			
			} catch(err) {
		    	console.error('Unable to retrieve refreshed token ', err);
			}
		});

		try {
			await messaging.requestPermission();
		  	console.log("Auth");
		  	const token = await messaging.getToken();

		  	if (token) {
		  		this.sendTokenToServer(token);
		  	} else {
				// Show permission request.
				console.log('No Instance ID token available. Request permission to generate one.');
				// Show permission UI.
				this.setTokenSentToServer(false);
			}

		} catch(err) {
			console.error('An error occurred while retrieving token. ', err);
  			this.setTokenSentToServer(false);
		}
	}
	sendTokenToServer(currentToken) {
		if (!this.isTokenSentToServer) {
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
	    	this.setTokenSentToServer(true);
		} else {
			console.log('Token already sent to server so won\'t send it again ' +
		      'unless it changes');
		}
	}
	get isTokenSentToServer() {
		return localStorage.getItem('sentToServer') === '1';
	}
	setTokenSentToServer(sent) {
		localStorage.setItem('sentToServer', sent ? '1' : '0');
	}

}

export default Messaging;
