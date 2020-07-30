const router = require('express').Router();
const { join } = require('path');
const { existsSync, mkdirSync, unlinkSync } = require('fs');

router
  .post('/upload/:type', (req, res) => {
    const { file } = req.files;
    const { name, mime, width } = req.body;
    const { type } = req.params;

    const path = join(__dirname, 'files');
    if (!existsSync(path)) { mkdirSync(path); }

    const filepath = join(path, name);
    file.mv(filepath, async () => {
      try {
        const data = await req.db.uploadFile(type, name, mime, filepath, width);

        unlinkSync(filepath);

        res.json(data);
      } catch (err) {
        console.error(err);
        res.status(500).json({
          status: err,
        });
      }
    });
  })
  .delete('/action-images/delete', async (req, res) => {
    try {
      const { name, secret } = req.body;

      const data = await req.db.deleteImage(name, secret);

      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).send(err.toString());
    }
  });

module.exports = router;
