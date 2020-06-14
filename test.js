// Server
const express = require('express');

const server = express();
const next = require('next');
const { join } = require('path');

// Express Middlewares
const session = require('express-session');
const fileUpload = require('express-fileupload');
const userAgent = require('express-ua-middleware');
const KnexSessionStore = require('connect-session-knex')(session);

// APIS
const Router = require('./lib/router');
const DB = require('./lib/server/Database');
const PostsManager = require('./lib/PostsManager');
const FacebookAPI = require('./lib/server/FacebookAPI');

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
    server
      .get('/', async (req, res) => {
        if (req.db) {
          const blogIsInstalled = await req.db.isInstalled();

          if (!blogIsInstalled) { res.redirect(302, '/install'); } else { next(); }
        } else { res.redirect(302, '/install'); }
      })
      .get('/install', async (req, res, next) => {
        res.type('html');

        if (req.db) {
          const blogIsInstalled = await req.db.isInstalled();

          if (!blogIsInstalled) { res.sendFile(join(__dirname, 'install')); } else { return next(); }
        } else { return res.sendFile(join(__dirname, 'install')); }
      })
      .get('/test-connection', async (req, res) => {
        try {
          const {
            client, user, password, server: host, port, database,
          } = req.query;

          const isValidate = await db
            .testConnection(client, user, password, host, port, database);

          if (isValidate) { res.send('success'); } else { res.send('error'); }
        } catch (err) {
          res.sendStatus(500).send('error');
        }
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
