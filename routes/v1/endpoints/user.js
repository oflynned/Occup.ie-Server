let ObjectId = require("mongodb").ObjectId;
let express = require('express');
let router = express.Router();

let createUserUseCase = require("../use_cases/user/user_account_creation");
let retrieveUserUseCase = require("../use_cases/user/user_account_retrieval");

module.exports = (db, env) => {
    const collection = env["users"];

    router.post("/", (req, res) => {
        createUserUseCase.validatePayload(req.body)
            .then(() => createUserUseCase.validateUserIsUnique(db, collection, req.body))
            .then(() => {
                createUserUseCase.generateUserObject(req.body)
                    .then((data) => createUserUseCase.createAccount(db, collection, data))
                    .then((data) => res.status(201).json(data))
                    .catch((err) => res.status(500).json(err))
            })
            .catch((err) => res.status(400).json(err))
    });

    router.get("/", (req, res) => {
        retrieveUserUseCase.getUsers(db, collection)
            .then((users) => res.status(200).json(users))
            .catch((err) => res.status(500).json(err))
    });

    router.get('/:uuid', (req, res) => {
        let uuid = req.params["uuid"];
        retrieveUserUseCase.getUsers(db, collection, {_id: ObjectId(uuid)})
            .then((user) => res.status(200).json(user))
            .catch((err) => res.status(500).json(err))
    });

    router.put('/:uuid', (req, res) => {
        let uuid = req.params["uuid"];
        createUserUseCase.validatePayload(req.body)
            .then(() => {
                retrieveUserUseCase.getUsers(db, collection, {_id: ObjectId(uuid)})
                    .then((user) => createUserUseCase.getUserParams(user[0], req.body))
                    .then((user) => retrieveUserUseCase.modifyUser(db, collection, user, uuid))
                    .then((user) => res.status(200).json(user))
                    .catch((err) => res.status(500).json(err))
            })
            .catch((err) => res.status(400).json(err))
    });

    router.delete('/:uuid', (req, res) => {
        let uuid = req.params["uuid"];
        retrieveUserUseCase.deleteUser(db, collection, uuid)
            .then((user) => res.status(200).send(user))
            .catch((err) => res.status(500).send(err))
    });

    return router;
};
