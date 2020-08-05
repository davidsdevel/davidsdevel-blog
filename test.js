// Server
const express = require('express');
const server = express();
const nextApp = require('next');

// Express Middlewares
const session = require('express-session');
const fileUpload = require('express-fileupload');
const userAgent = require('express-ua-middleware');
const KnexSessionStore = require('connect-session-knex')(session);
const { renderPost } = require('./middlewares/posts');
const expressip = require('express-ip');

// APIS
const Router = require('./lib/router');
const DB = require('./lib/server/Database');
const PostsManager = require('./lib/PostsManager');
const FacebookAPI = require('./lib/server/FacebookAPI');

// Router
const rootRouter = require('./routes/root');
const apiRouter = require('./routes/api');

const dev = process.env.NODE_ENV !== 'production';
const app = nextApp({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;

const db = new DB();
const posts = new PostsManager(db);
const router = new Router(db);
const facebook = new FacebookAPI({
  appID: process.env.APP_ID,
  appSecret: process.env.APP_SECRET,
});

const sess = {
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 3600000 * 24,
  }
};
    
 if (!dev) {
   sess.cookie.secure = true;
   server.set('trust proxy', 1); // trust first proxy
 }
      
server
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use(fileUpload())
  .use(userAgent)
  .use(expressip().getIpInfoMiddleware);

/**
 * Test Database
 * 
 * @param {Object} data
 * 
 * @return {Promise<String>}
 */
async function testDatabase({
  client, user, password, server: host, port, database,
}) {
  try {
    const isValidate = await DB.testConnection(client, user, password, host, port, database);

    if (isValidate)
      return Promise.resolve('success');
    else
      return Promise.resolve('error');

  } catch(err) { return Promise.reject(err); }
}

async function install(req, {
  client, user, password, server: host, port, database,
}) {
  try {

    await db.connect(client, process.env.DATABASE_URL);

    sess.store = new KnexSessionStore({
      knex: db.db,
    });

    server
      .use(session(sess))
      .use('/', rootRouter)
      .use('/api', apiRouter);

    await db.init("David", "González", "davidsdevel@gmail.com", "1234");

    req.db = db;
    req.posts = posts;
    req.router = router;
    req.fb = facebook;
    req.handle = handle;

    return Promise.resolve();
  } catch(err) {
    return Promise.reject(err);
  }
}

async function initApp() {
  try {
    console.log('Preparing...');
    await app.prepare();
    await install(server.request, {
      client: "sqlite3"
    });

    console.log('Prepared');

    server
      .get('/:title', renderPost(), (pass, req, res, next) => {
        if (pass && req.urlID === '1') {
          return app.render(req, res, '/post', req.data);
        }

        return next();
      })
      .get('/:category/:title', renderPost(), async (pass, req, res) => {
        let sameCategory = false;

        try {
          if (pass) {
            const { category } = req.params;
            const categories = await req.db.getCategories();

            for (let i = categories.length - 1; i >= 0; i - 1) {
              if (categories[i].name === category) {
                sameCategory = true;
                break;
              }
            }
          }
        } catch (err) {
          console.error("> Posts Category", err);
          return res.status(500).send(err.toString());
        }

        if (sameCategory && req.urlID === '2') {
          return app.render(req, res, '/post', req.data);
        }

        return next();
      })
      .get('/:year/:month/:title', renderPost(), (pass, req, res, next) => {
        const { year } = req.params;

        if (/\d\d\d\d/.test(year) && req.urlID === '3') {
          return app.render(req, res, '/post', req.data);
        }
        return next();
      })
      .get('/:year/:month/:day/:title', renderPost(), (pass, req, res, next) => {
        const { year, month, day } = req.params;

        if ((!/\d\d\d\d/.test(year) || !/\d\d?/.test(month) || !/\d\d?/.test(day)) && req.urlID === '4') {
          return app.render(req, res, '/post', req.data);
        }
        return next()
      })
      .get('*', (req, res) => handle(req, res))
      .listen(PORT, (err) => {
        if (err) throw new Error(err);
        console.log(`> App Listen on Port: ${PORT}`);
      });
  } catch (err) {
    throw new Error(err);
  }
}

initApp();

