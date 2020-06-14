// Server
const express = require('express');

const server = express();
const next = require('next');

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
const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');
const blogRouter = require('./routes/blog');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;

const db = new DB(dev);
const posts = new PostsManager(db);
const router = new Router(db);
const facebook = new FacebookAPI({
  appID: '337231497026333',
  appSecret: 'd381bb7dcf6bd6c6adb0806985de7d49',
});

const sess = {
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 3600000 * 24,
  },
  store: new KnexSessionStore({
    knex: db.db,
  }),
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
  .use(session(sess));

async function Init() {
  try {
    console.log('Preparing...');
    await app.prepare();
    console.log('Prepared');

    server
      .use('/', rootRouter)
      .use('/posts', postsRouter)
      .use('/users', usersRouter)
      .use('/blog', blogRouter)
      .get('/test-connection', async (req, res) => {
        try {
          const {
            client, user, password, server: host, port, database,
          } = req.query;

          const isValidate = await db.testConnection(client, user, password, host, port, database);

          if (isValidate) { res.send('success'); } else { res.send('error'); }
        } catch (err) {
          res.sendStatus(500).send('error');
        }
      })
      .get('/init-app', async (req) => {
        const {
          client, user, password, server: host, port, database,
        } = req.query;

        await db.connect(client, user, password, host, port, database);
        await db.init();

        req.db = db;
        req.posts = posts;
        req.router = router;
        req.fb = facebook;

        return next();
      })
      .get('/images/:all', (req, res) => handle(req, res))
      .get('/assets/:all', (req, res) => handle(req, res))
      .get('/:title', renderPost(), (pass, req, res) => {
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
          console.error(err);
          return res.status(500).send(err.toString());
        }

        if (sameCategory && req.urlID === '2') {
          return app.render(req, res, '/post', req.data);
        }

        return next();
      })
      .get('/:year/:month/:title', renderPost(), (pass, req, res) => {
        const { year } = req.params;

        if (/\d\d\d\d/.test(year) && req.urlID === '3') {
          app.render(req, res, '/post', req.data);
        }

        return next();
      })
      .get('/:year/:month/:day/:title', renderPost(), (pass, req, res) => {
        const { year, month, day } = req.params;

        if ((!/\d\d\d\d/.test(year) || !/\d\d?/.test(month) || !/\d\d?/.test(day)) && req.urlID === '4') {
          app.render(req, res, '/post', req.data);
        }

        return next();
      })
      .get('*', async (req, res) => {
        if (req.db) {
          const blogIsInstalled = await req.db.isInstalled();

          if (!blogIsInstalled) { res.sendStatus(404); } else { handle(req, res); }
        } else { res.sendStatus(404); }
      })
      .listen(PORT, (err) => {
        if (err) throw new Error(err);
        console.log(`> App Listen on Port: ${PORT}`);
      });
  } catch (err) {
    throw new Error(err);
  }
}

Init();
