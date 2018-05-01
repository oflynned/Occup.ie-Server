let express = require('express');
let router = express.Router();
let retrieveFeatureFlags = require("../../../models/use_cases/common/retrieve_feature_flags");

module.exports = () => {
    router.get("/", (req, res) => {
        retrieveFeatureFlags.loadAllJson()
            .then((flags) => res.status(200).json(flags))
            .catch(() => res.status(500).send());
    });

    router.get("/:filename", (req, res) => {
        retrieveFeatureFlags.loadFeatureFlags(req.params["filename"])
            .then((flags) => res.status(200).json(flags))
            .catch(() => res.status(500).send());
    });

    router.patch("/", (req, res) => {
        // TODO allow admin console to turn flags on and off
    });

    return router;
};
