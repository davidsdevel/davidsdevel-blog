import * as firebase from 'firebase/app';
import 'firebase/messaging';

export default class Messaging {
  constructor(config) {
    this.config = config;
    let app;

    if (!firebase.apps.length) {
      app = firebase.initializeApp(this.config);
    } else {
      app = firebase.app();
    }

    this.messaging = firebase.messaging(app);

    this.messaging.usePublicVapidKey(process.env.MESSAGING_KEY);

    this.tokenSent = localStorage.getItem('sentToServer') === 1;
  }

  async init() {
    this.messaging.onTokenRefresh(async () => {
      try {
        const refreshedToken = await this.messaging.getToken();
        this.setTokenSentToServer(false);
        // Send Instance ID token to app server.
        await this.sendTokenToServer(refreshedToken);
      } catch (err) {
        console.error('Unable to retrieve refreshed token ', err);
      }
    });
  }

  async getToken() {
    try {
      await this.messaging.requestPermission();
      const token = await this.messaging.getToken();

      if (token) {
        return await this.sendTokenToServer(token);
      }

      this.setTokenSentToServer(false);
      return Promise.resolve('no-token');
    } catch (err) {
      console.error(`Error sending token to server${err}`);
      return Promise.reject(err);
    }
  }

  async sendTokenToServer(currentToken) {
    if (!this.isTokenSentToServer) {
      try {
        const ID = localStorage.getItem('userID');
        const req = await fetch('/api/users/add-fcm-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: currentToken,
            ID: ID || '',
          }),
        });

        if (req.status >= 400) { return Promise.reject(); }

        const data = await req.json();

        if (data.status === 'OK') {
          this.setTokenSentToServer(true);

          return Promise.resolve();
        }
        return Promise.reject();
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return Promise.resolve();
  }

  get isTokenSentToServer() {
    return this.tokenSent;
  }

  setTokenSentToServer(sent) {
    localStorage.setItem('sentToServer', sent ? '1' : '0');
    this.tokenSent = !!sent;
  }
}
