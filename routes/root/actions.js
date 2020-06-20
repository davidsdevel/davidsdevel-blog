const router = require('express').Router();
const urlModule = require('url');
const Jimp = require('jimp');
const qs = require('qs');
const fetch = require('isomorphic-fetch');
const { join } = require('path');

router
  .post('/admin-login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const login = await req.db.login(email, password);

      if (login.pass) {
        delete login.message;
        delete login.pass;

        req.session.adminAuth = true;
        req.session.account = login;
        
        res.json({
          status: 'OK',
        });
      } else {
        res.json({
          status: 'Error',
          message: login.message,
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send(err.toString());
    }
    })
    .get('/logout', (req, res) => {
    if (!req.session.adminAuth) { res.sendStatus(404); }
    else {
      req.session.adminAuth = false;
      req.session.account = undefined;

      res.send('success');
    }
  })
  .post('/fb-webhook', (req, res) => {
    const { body } = req;
    // Checks this is an event from a page subscription
    if (body.object === 'application') {
      // Iterates over each entry - there may be multiple if batched
      body.entry.forEach(async (entry) => {
        const commentId = entry.changes[0].value.id;
        try {
          // TODO: use long live access token

          const accessToken = await req.fb.getAccessToken();

          const fetchUrl = await fetch(`https://graph.facebook.com/${commentId}?fields=permalink_url&access_token=${accessToken}`);
          const linkData = await fetchUrl.json();

          const permalinkUrl = linkData.permalink_url;

          console.log(permalinkUrl);

          const urlQuery = urlModule.parse(permalinkUrl);
          const parsedQuery = qs.parse(urlQuery);
          const postPath = /development|design|marketing|technology|others\/(\w*-)*\w(?=\?)/.exec(parsedQuery.u)[0];

          await req.db.setComment(postPath);
        } catch (err) {
          console.error(err);
          res.sendStatus(500);
        }

        // Gets the message. entry.messaging is an array, but
      });
      // Returns a '200 OK' response to all requests
      res.status(200).send('EVENT_RECEIVED');
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  })
  .get('/fb-webhook', (req, res) => {
    // Your verify token. Should be a random string.
    const VERIFY_TOKEN = 'C@mila';

    // Parse the query params
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
      // Checks the mode and token sent is correct
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        // Responds with the challenge token from the request
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);
      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);
      }
    }
  })
  .get('/resize-image', async (req, res) => {
    try {
      const { url, width, height } = req.query;

      const urlSplitted = url.split('.');
      const mime = urlSplitted[urlSplitted.length - 1];
      res.type(mime);

      const image = await Jimp.read(url.startsWith('/') ? `http://localhost:3000${url}` : url);

      image
        .resize(width ? width * 1 : Jimp.AUTO, height ? height * 1 : Jimp.AUTO)
        .getBuffer(Jimp.AUTO, (err, buffer) => {
          if (err) {
            console.error(err);
            res.status(500).send(err.toString());
          } else {
            res.send(buffer);
          }
        });
    } catch (err) {
      console.error(err);
      res.status(500).send(err.toString());
    }
  })
  .get('/preview/:secret/:ID', async (req, res, next) => {
    const { ID, secret } = req.params;

    if (parseInt(`0x${secret}` * 1, 10) !== 3) { return next(); }

    const data = await req.db.getPostByID(ID);

    const {
      image, content, title, tags, updated, description, category, published,
    } = data;

    return req.nextApp.render(req, res, '/post', {
      isSubscribe: false,
      isPreview: true,
      image,
      content,
      title,
      tags,
      updated,
      description,
      category,
      ID: data.ID,
      published,
    });
  });

module.exports = router;
