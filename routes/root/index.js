const router = require('express').Router();

router.use(require('./files'));
router.use(require('./data'));
router.use(require('./actions'));

module.exports = router;
