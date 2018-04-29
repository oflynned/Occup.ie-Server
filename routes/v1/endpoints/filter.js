let express = require('express');
let router = express.Router();

module.exports = (env, db) => {
    router.get("/:type", (req, res) => {
        let params = req.params
    });

    return router;
};
