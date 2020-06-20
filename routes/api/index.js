const router = require('express').Router();

router
    .use((req, res, next) => {
        const accessToken = req.get("Access-Token");

        if (accessToken !== process.env.ACCESS_TOKEN) {res.sendStatus(401)}

        return next();
    })
    .use("/blog", require('./blog'))
    .use("/colaborators", require('./colaborators'))
    .use("/posts", require('./posts'))
    .use("/users", require('./users'));

module.exports = router;
