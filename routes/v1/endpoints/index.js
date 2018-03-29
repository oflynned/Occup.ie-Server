let express = require('express');
let router = express.Router();
let dbSeed = require("../../../config/ops/system_checks/db_seed");
let path = require('path');

function checkParams(seedType, seedSize) {
    return new Promise((res, rej) => {
        const seedTypes = ["landlord", "user", "rental", "house-share", "application"];
        if (!seedTypes.includes(seedType)) rej();
        if (seedSize < 1 || isNaN(seedSize)) rej();
        res();
    });
}

module.exports = (db, env) => {
    router.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../../../views/index.html'));
    });

    router.get('/ping', (req, res) => {
        res.send("pong");
    });

    router.get('/purge', (req, res) => {
        dbSeed.purge(env, db)
            .then((count) => res.status(200).send(`${count} records purged`))
    });

    router.get('/seed/:size', (req, res) => {
        let seedSize = req.params["size"];

        dbSeed.purge(env, db)
            .then(() => dbSeed.seedAll(env, db, seedSize))
            .then(() => res.status(200).json({seed_size: seedSize}))
            .catch((err) => res.status(400).json(err))
    });

    router.get('/seed/:type/:size', (req, res) => {
        let seedType = req.params["type"].toLowerCase();
        let seedSize = req.params["size"];

        checkParams(seedType, seedSize)
            .then(() => dbSeed.purge(env, db))
            .then(() => dbSeed.seed(env, db, seedType, seedSize))
            .then(() => res.status(200).json({seed_type: seedType, seed_size: seedSize}))
            .catch(() => res.status(400).send())
    });

    return router;
};