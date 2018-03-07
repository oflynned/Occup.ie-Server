let express = require('express');
let router = express.Router();

module.exports = (db, env) => {
    router.get('/ping', (req, res) => {
        res.send("pong");
    });

    router.get('/seed', (req, res) => {
        res.status(200).send()
    });

    return router;
};