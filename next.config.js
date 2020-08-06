module.exports = {
  env: {
    AUTH_TOKEN: '3031334e31562e733363723374',
    ORIGIN: process.env.NODE_ENV === 'production'
      ? process.env.HOST || 'https://davidsdevel-blog-test.herokuapp.com'
      : 'http://localhost:3000',
  },
};
