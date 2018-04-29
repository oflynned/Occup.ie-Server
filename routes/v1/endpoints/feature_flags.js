let express = require('express');
let router = express.Router();
let retrieveFeatureFlags = require("../../../models/use_cases/common/retrieve_feature_flags");

module.exports = () => {
    router.get("/", (req, res) => {
        retrieveFeatureFlags.loadFeatureFlags("global_flags")
            .then((flags) => res.status(200).json(flags))
            .catch(() => res.status(500).send());
    });

    return router;
};
