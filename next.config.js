module.exports = {
  env: {
    AUTH_TOKEN: '3031334e31562e733363723374',
    ORIGIN: process.env.NODE_ENV === 'production'
      ? process.env.HOST || 'https://davidsdevel-blog-test.herokuapp.com'
      : 'http://localhost:3000',
	FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID,
	FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
	FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
	FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
	FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL,
	FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
	FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
	MESSAGING_KEY: process.env.MESSAGING_KEY,
  },
};
