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

// APIS
const Router = require('./lib/router');
const DB = require('./lib/server/Database');
const PostsManager = require('./lib/PostsManager');
const FacebookAPI = require('./lib/server/FacebookAPI');

// Router
const rootRouter = require('./routes/root');
const apiRouter = require('./routes/api');

const dev = process.env.NODE_ENV !== 'production';
const app = nextApp({ dev, quiet: dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;

const db = new DB(dev);
const posts = new PostsManager(db);
const router = new Router(db);
const facebook = new FacebookAPI({
  appID: process.env.APP_ID,
  appSecret: process.env.APP_SECRET,
});

server
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use(fileUpload())
  .use(userAgent)
  .use('/', rootRouter)
  .use('/api', apiRouter);

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
    const isValidate = await db.testConnection(client, user, password, host, port, database);

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

    
    await db.connect(client, user, password, host, port, database);
    await db.init();
    
    req.db = db;
    req.posts = posts;
    req.router = router;
    req.fb = facebook;
    req.handle = handle;

    const sess = {
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 3600000 * 24,
      },
      /*store: new KnexSessionStore({
        knex: db.db,
      }),*/
    };
    
    if (!dev) {
      sess.cookie.secure = true;
      server.set('trust proxy', 1); // trust first proxy
    }

    server.use(session(sess));

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
        client: "mysql",
        user: "root",
        password: "",
        server: "localhost",
        port: "3306",
        database: "blog"
    })
    console.log('Prepared');

    server
      .get('/:title', renderPost(), (pass, req, res) => {
        if (pass && req.urlID === '1') {
          return app.render(req, res, '/post', req.data);
        }

        return;
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
          console.error(err);
          return res.status(500).send(err.toString());
        }

        if (sameCategory && req.urlID === '2') {
          return app.render(req, res, '/post', req.data);
        }

        return;
      })
      .get('/:year/:month/:title', renderPost(), (pass, req, res, next) => {
        const { year } = req.params;

        if (/\d\d\d\d/.test(year) && req.urlID === '3') {
          app.render(req, res, '/post', req.data);
        }

        return;
      })
      .get('/:year/:month/:day/:title', renderPost(), (pass, req, res, next) => {
        const { year, month, day } = req.params;

        if ((!/\d\d\d\d/.test(year) || !/\d\d?/.test(month) || !/\d\d?/.test(day)) && req.urlID === '4') {
          app.render(req, res, '/post', req.data);
        }

        return;
      })
      .get('*', async (req, res) => {
        console.log(req.url)
        return handle(req, res);
      })
      .listen(PORT, (err) => {
        if (err) throw new Error(err);
        console.log(`> App Listen on Port: ${PORT}`);
      });
  } catch (err) {
    throw new Error(err);
  }
}

initApp();

