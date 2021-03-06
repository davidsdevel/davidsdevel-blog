const router = require('express').Router();

/**
 * Config Data
 *
 * @public
 *
 * @param {Object} db
 * @param {Object} options
 *
 * @return {Object}
 */
async function configdata(db, {
  categories,
  urlID,
  title,
  description,
}) {
  try {
    const data = {};

    if (categories) { data.categories = await db.getCategories(); }

    if (urlID) { data.urlID = await db.getUrlID(); }

    if (title) { data.title = await db.getBlogTitle(); }

    if (description) { data.description = await db.getBlogDescription(); }

    return data;
  } catch (err) {
    return err;
  }
}

router
  .get('/:action', async (req, res) => {
    try {
      const { action } = req.params;
      let data;

      switch (action) {
        case 'categories':
          data = await configdata(req.db, {
            categories: true,
          });
          break;
        case 'config':
          data = await configdata(req.db, {
            categories: true,
            title: true,
            urlID: true,
            description: true,
          });
          break;
        case 'images':
          data = await req.db.getImages();
          break;
        case 'stats':
          data = await req.db.getStats();
          break;
        default:
          res.sendStatus(404);
          break;
      }

      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).send(err.toString());
    }
  })
  .post('/:action', async ({ params, body, db }, res) => {
    try {
      const { action } = params;
      const {
        name, alias, cms, data,
      } = body;

      switch (action) {
        case 'add-category':
          res.send(await db.addCategory(name, alias));
          break;
        case 'import-posts':
          if (cms === 'blogger') {
            await db.importPostsFromBlogger(data);
            res.send('success');
          } else if (cms === 'wordpress') {
            await db.importPostsFromWordPress(data);
            res.send('success');
          } else { res.sendStatus(401); }

          break;
        case 'config':
          await db.saveConfig(data);

          res.json({
            status: 'success',
          });

          break;
        default:
          res.status(404);
          break;
      }
    } catch (err) {
      console.error(err);
      res.status(500).send(err.toString());
    }
  })
  .delete('/:action', async ({ params, body, db }, res) => {
    try {
      const { action } = params;
      const { name } = body;

      switch (action) {
        case 'delete-category':
          res.send(await db.deleteCategory(name));
          break;
        default:
          res.status(404);
          break;
      }
    } catch (err) {
      console.error(err);

      res.status(500).send(err.toString());
    }
  });

module.exports = router;
