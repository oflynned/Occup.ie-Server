let ObjectId = require("mongodb").ObjectId;
let express = require('express');
let router = express.Router();

let createUserUseCase = require("../use_cases/user/user_account_creation");
let retrieveUserUseCase = require("../use_cases/user/user_account_retrieval");

module.exports = (db, env) => {
    const collection = env["users"];

    router.post("/", (req, res) => {
        createUserUseCase.validatePayload(req.body)
            .then(() => createUserUseCase.validateUserAge(req.body))
            .then(() => createUserUseCase.validateUserIsUnique(db, collection, req.body))
            .then(() => createUserUseCase.createAccount(db, collection, req.body))
            .then((data) => res.status(201).json(data))
            .catch((err) => {
                switch (err.message) {
                    case "bad_request":
                        res.status(400).json(err);
                        break;
                    case "user_not_unique":
                    case "underage_user":
                        res.status(403).json(err);
                        break;
                    default:
                        res.status(500).json(err);
                        break;
                }
            })
    });

    router.get("/", (req, res) => {
        retrieveUserUseCase.getUsers(db, collection)
            .then((users) => res.status(200).json(users))
            .catch((err) => res.status(500).json(err))
    });

    router.get('/:uuid', (req, res) => {
        let uuid = req.params["uuid"];
        retrieveUserUseCase.doesUserExist(db, collection, {_id: ObjectId(uuid)})
            .then(() => retrieveUserUseCase.getUsers(db, collection, {_id: ObjectId(uuid)}))
            .then((users) => res.status(200).json(users[0]))
            .catch((err) => {
                switch (err.message) {
                    case "non_existent_user":
                        res.status(404).send();
                        break;
                    default:
                        res.status(500).json(err);
                        break;
                }
            })
    });

    router.put('/:uuid', (req, res) => {
        let uuid = ObjectId(req.params["uuid"]);
        retrieveUserUseCase.getUsers(db, collection, uuid)
            .then((users) => createUserUseCase.generateModifiedRecord(users[0], req.data))
            .then((user) => createUserUseCase.validatePayload(user))
            .then(() => retrieveUserUseCase.modifyUser(db, collection, req.body, uuid))
            .then((user) => res.status(200).json(user))
            .catch((err) => {
                switch (err.message) {
                    case "bad_request":
                        res.status(400).send();
                        break;
                    case "non_existent_user":
                        res.status(404).send();
                        break;
                    default:
                        res.status(500).send();
                        break;
                }
            })
    });

    router.delete('/:uuid', (req, res) => {
        let uuid = req.params["uuid"];
        retrieveUserUseCase.doesUserExist(db, collection, {_id: ObjectId(uuid)})
            .then(() => retrieveUserUseCase.deleteUser(db, collection, uuid))
            .then((user) => res.status(200).send(user))
            .catch((err) => {
                switch (err.message) {
                    case "non_existent_user":
                        res.status(404).send();
                        break;
                    default:
                        res.status(500).send();
                        break;
                }
            })
    });

    return router;
};
