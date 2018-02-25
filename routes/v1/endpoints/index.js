let express = require('express');
let router = express.Router();

module.exports = () => {
    router.get('/ping', (req, res) => {
        res.send("pong");
    });

    return router;
};

