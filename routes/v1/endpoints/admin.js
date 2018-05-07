let ObjectId = require("mongodb").ObjectId;
let express = require('express');
let router = express.Router();

let createUserUseCase = require("../../../models/use_cases/user/user_account_creation");
let retrieveUserUseCase = require("../../../models/use_cases/user/user_account_retrieval");

module.exports = (db, env) => {
    const collection = env["users"];

    router.head("/", (req, res) => {

    });

    return router;
};
