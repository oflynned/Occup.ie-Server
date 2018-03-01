let ObjectId = require("mongodb").ObjectId;
let express = require('express');
let router = express.Router();

let createUserUseCase = require("../use_cases/user/create_user");
let retrieveUserUseCase = require("../use_cases/user/retrieve_user");

module.exports = (db) => {
    router.post("/", (req, res) => {
        createUserUseCase.validatePayload(req.body)
            .then(() => createUserUseCase.validateUserIsUnique(db, req.body))
            .then(() => {
                createUserUseCase.generateUserObject(req.body)
                    .then((data) => createUserUseCase.createAccount(db, data))
                    .then((data) => res.status(201).json(data))
                    .catch((err) => res.status(500).json(err))
            })
            .catch((err) => res.status(400).json(err))
    });

    router.get("/", (req, res) => {
        retrieveUserUseCase.getUsers(db)
            .then((users) => res.status(200).json(users))
            .catch((err) => res.status(500).json(err))
    });

    router.get('/:uuid', (req, res) => {
        let uuid = req.params["uuid"];
        retrieveUserUseCase.getUsers(db, {_id: ObjectId(uuid)})
            .then((user) => res.status(200).json(user))
            .catch((err) => res.status(500).json(err))
    });

    router.put('/:uuid', (req, res) => {
        let uuid = req.params["uuid"];
        createUserUseCase.validatePayload(req.body)
            .then(() => {
                retrieveUserUseCase.getUsers(db, {_id: ObjectId(uuid)})
                    .then((user) => createUserUseCase.getUserParams(user[0], req.body))
                    .then((user) => retrieveUserUseCase.modifyUser(db, uuid, user))
                    .then((user) => res.status(200).json(user))
                    .catch((err) => res.status(500).json(err))
            })
            .catch((err) => res.status(400).json(err))
    });

    router.delete('/:uuid', (req, res) => {
        let uuid = req.params["uuid"];
        retrieveUserUseCase.deleteUser(db, uuid)
            .then((user) => res.status(200).send(user))
            .catch((err) => res.status(500).send(err))
    });

    router.post('/verify', (req, res) => {
        res.status(200).send("TODO verify")
    });

    return router;
};
