let express = require('express');
let router = express.Router();

module.exports = (db) => {
    router.get("/", (req, res) => {
        let params = req.params
    });

    return router;
};
