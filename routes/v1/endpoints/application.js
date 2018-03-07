let express = require('express');
let router = express.Router();
let ObjectId = require('mongodb').ObjectID;

let createApplicationUseCase = require('../use_cases/application/application_creation');
let retrieveApplicationUseCase = require('../use_cases/application/application_retrieval');

module.exports = (db, col) => {
    const collection = col["applications"];

    router.post('/', (req, res) => {
        let payload = req.body;
        createApplicationUseCase.validatePayload(payload)
            .then(() => createApplicationUseCase.validateApplicationIsUnique(db, collection, payload))
            //.then(() => createApplicationUseCase.validateApplicationIsFitting(db, collection, payload))
            .then(() => createApplicationUseCase.createApplication(db, collection, payload))
            .then((data) => res.status(201).json(data))
            .catch((err) => {
                switch (err.message) {
                    case "bad_request":
                        res.status(400).send();
                        break;
                    case "":
                        res.status(403).send();
                        break;
                    default:
                        res.status(500).send();
                        break;
                }
            })
    });

    router.get('/', (req, res) => {
        retrieveApplicationUseCase.getApplications(db)
            .then((properties) => res.status(200).json(properties))
            .catch((err) => {
                switch (err.message) {
                    case "bad_request":
                        res.status(400).send();
                        break;
                    default:
                        res.status(500).send();
                        break;
                }
            })
    });

    router.get('/:uuid', (req, res) => {
        let uuid = req.params["uuid"];
        retrieveApplicationUseCase.getApplications(db, collection, {_id: ObjectId(uuid)})
            .then((properties) => res.status(200).json(properties))
            .catch((err) => {
                switch (err.message) {
                    case "bad_request":
                        res.status(400).send();
                        break;
                    default:
                        res.status(500).send();
                        break;
                }
            })
    });

    router.put('/:uuid', (req, res) => {
        let uuid = req.params["uuid"];
        createApplicationUseCase.validatePayload(req.data)
            .then(() => retrieveApplicationUseCase.modifyListing(db, collection, req.body, uuid))
            .then(() => res.status(200).send())
            .catch((err) => {
                switch (err.message) {
                    case "bad_request":
                        res.status(400).send();
                        break;
                    default:
                        res.status(500).send();
                        break;
                }
            })
    });

    router.delete('/:uuid', (req, res) => {
        let uuid = req.params["uuid"];
        retrieveApplicationUseCase.deleteApplication(db, collection, uuid)
            .then((property) => res.status(200).json(property))
            .catch((err) => {
                switch (err.message) {
                    case "bad_request":
                        res.status(400).send();
                        break;
                    default:
                        res.status(500).send();
                        break;
                }
            })
    });

    return router;
};