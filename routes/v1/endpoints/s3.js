let ObjectId = require("mongodb").ObjectId;
let express = require('express');
let router = express.Router();

let createListingUseCase = require("../../../models/use_cases/listing/house_share_creation");
let retrieveListingUseCase = require("../../../models/use_cases/listing/house_share_retrieval");

module.exports = (db, env) => {
    const collection = env["listings"];

    router.post("/", (req, res) => {

    });

    return router;
};
