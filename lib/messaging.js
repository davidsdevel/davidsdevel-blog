import firebase from "firebase/app";
import "firebase/messaging";

class Messaging {
	constructor(config) {
		this.config = config;
		this.messaging;
	}
	async init() {

		firebase.initializeApp(this.config);
		this.messaging = firebase.messaging();

		this.messaging.onTokenRefresh(async () => {
			try {
				const refreshedToken = await this.messaging.getToken();
		    	console.log('Token refreshed.');
		    	this.setTokenSentToServer(false);
		    	// Send Instance ID token to app server.
		    	await this.sendTokenToServer(refreshedToken);
			
			} catch(err) {
		    	console.error('Unable to retrieve refreshed token ', err);
			}
		});

		//Declare as Global var
		window.fcm = this;

		try {
			await this.messaging.requestPermission();
		  	console.log("Auth");
		  	const token = await this.getToken();
		  	await this.sendTokenToServer(token);


		} catch(err) {
			console.error('An error occurred while retrieving token. ', err);
  			this.setTokenSentToServer(false);
		}
	}
	async getToken() {
		try {
			const token = await this.messaging.getToken();

		  	if (token) {
		  		return Promise.resolve(token);
		  	} else {
				// Show permission request.
				console.log('No Instance ID token available. Request permission to generate one.');
				// Show permission UI.
				this.setTokenSentToServer(false);
				return Promise.reject("no-token");
			}
		} catch(err) {
			console.error("Error sending token to server" + err);
			return Promise.reject(err);
		}
	}
	async sendTokenToServer(currentToken) {
		if (!this.isTokenSentToServer) {
			console.log('Sending token to server...');
			try {
				const email = localStorage.getItem("email");
				const req = await fetch("/users/add-fcm-token", {
					method:"POST",
					headers: {
						"Content-Type": "application/json"
					},
					body:JSON.stringify({
						token: currentToken,
						email: email || ""
					})
				});

				if (req.status >= 400)
					return Promise.reject();
				else {
					const data = await req.json();

					if (data.status === "OK")
						return Promise.resolve();
					else
						return Promise.reject();
				}
			} catch(err) {
				return Promise.reject(err);
			}
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
