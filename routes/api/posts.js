const router = require('express').Router();

/**
 * Parse
 *
 * @param {Object} postData
 * @param {String} fields
 *
 * @return {Object}
 */
function parse (postData, fields) {
  const newData = {};

  const parsedFields = fields.split(',');

  Object.entries(postData).forEach((e) => {
    for (let i = 0; i < parsedFields.length; i = i + 1) {
      const name = e[0];
      const value = e[1];

      if (name === parsedFields[i]) {
        newData[name] = value;
      }
    }
  });

  return newData;
};

router
  .get('/:action', async (req, res, next) => {
    try {
      const { action } = req.params;
      const {
        page,
        fields,
        ID,
        q,
      } = req.query;

      let data;

      switch (action) {
        case 'all':
          data = await req.posts.all(page);
          break;
        case 'all-edit':
          data = await req.posts.allEdit();
          break;
        case 'single':
          data = await req.posts.single(ID);
          break;
        case 'single-edit':
          data = await req.posts.singleEdit(ID);
          break;
        case 'most-viewed':
          data = await req.db.getMostViewed();
          break;
        case 'search':
          try {
            data = await req.db.searchPost(q, true, page);
          } catch (err) {
            if (err === 'dont-exists') { return res.status(200).send({ posts: [] }); }
            return res.status(500).send(err.toString());
          }
          break;
        default: break;
      }

      if (fields) {
        if (action === 'all-edit'
          || action === 'all'
          || action === 'search'
          || action === 'category'
          || action === 'category-edit'
        ) {
          data = {
            ...data,
            posts: data.posts.map((e) => parse(e, fields)),
          };
        }
        else { data = parse(data, fields); }
      }

      res.json(data);
    } catch (err) {
      console.error(err);
      if (err === 'dont-exists') { res.status(404).send(err); }
      else { res.status(500).send(err); }
    }
  })
  .delete('/:action', async (req, res) => {
    try {
      const { action } = req.params;
      const { ID, url } = req.body;

      switch (action) {
        case 'delete':
          res.json(await req.db.deletePost(ID, url));
          break;
        default:
          res.sendStatus(404);
          break;
      }
    } catch (err) {
      res.status(500).send(err.toString());
    }
  })
  .post('/:action', async (req, res, next) => {
    try {
      const { action } = req.params;
      const { url, referer } = req.body;

      let id;
      switch (action) {
        case 'publish':
          id = await req.db.publishPost(req.body);
          break;
        case 'save':
          id = await req.db.savePost(req.body);
          break;
        case 'set-view':

          if (req.session.adminAuth) { return res.send('success'); }

          try {
            await req.posts.setView(url, referer, req.userAgent);
          } catch (err) {
            if (err === 'dont-exists') { return res.status(404).send(err); }
            return res.status(500).send(err);
          }
          return res.send('success');
        default: break;
      }

      res.send(id.toString());
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }

    return next();
  });

module.exports = router;
