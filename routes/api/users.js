const router = require('express').Router();

router
  .get("/v/:emailHex", async ({query, params, db}, res) => {
    const {key} = query;
    const {emailHex} = params;

    try {
      const userVerified = await db.verifyUser(Buffer.from(emailHex, "hex").toString("utf-8"), key);

      if (userVerified) {
        res.redirect(302, "/");
      } else {
        res.status(404);
      }
      //TODO: Implement Redirects or Render page on successfully or on error verification
    } catch(err) {
      res.status(500).send(err.toString());
    }
  })
  .get('/:action', async (req, res) => {
    try {
      const { action } = req.params;
      const { name, lastname, email } = req.query;

      switch (action) {
        case 'check-username':
          res.json(await req.db.checkUsername(name, lastname));
          break;
        case 'check-email':
          res.json(await req.db.checkEmail(email));
          break;
        default: break;
      }
    } catch (err) {
      console.error(err);
      res.status(500).send(err.toString());
    }
  })
  .post('/:action', async (req, res) => {
    const { action } = req.params;
    const {
      token, name, lastname, email, feed, ID,
    } = req.body;

    let data;
    try {
      switch (action) {
        case 'add-fcm-token':
          await req.db.addFCMToken(token, ID);
          data = {
            status: 'OK',
          };
          break;
        case 'create-user':
          data = await req.db.createUser(name, lastname, email, feed, token);
          req.session.isSubscribe = true;
          break;
        default:
          return res.status(404);
      }
    } catch (err) {
      console.error(err);
      return res.status(500).send(err.toString());
    }

    return res.json(data);
  });

module.exports = router;
