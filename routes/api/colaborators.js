const router = require('express').Router();

router
  .get('/:action', async (req, res) => {
    try {
      const { action } = req.params;

      switch (action) {
        case 'all':
          res.json(await req.db.allColaborators());
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(error);
      res.status(500).send(error.toString());
    }
  })
  .post('/:action', () => {

  });

module.exports = router;
