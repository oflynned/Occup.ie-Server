let express = require('express');
let router = express.Router();
let ObjectId = require('mongodb').ObjectID;

let createApplicationUseCase = require('../use_cases/user/create_application');
let retrieveApplicationUseCase = require('../use_cases/common/application_retrieval');

module.exports = (db) => {
    router.post('/', (req, res) => {
        let payload = req.body;
        createApplicationUseCase.validatePayload(payload)
            .then(() => createApplicationUseCase.validateApplicationIsUnique(db, payload))
            .then(() => {
                createApplicationUseCase.createApplication(db, payload)
                    .then((data) => res.status(201).json(data))
                    .catch((err) => res.status(500).json(err))
            })
            .catch((err) => res.status(400).json(err))
    });

    router.get('/', (req, res) => {
        retrieveApplicationUseCase.getApplications(db)
            .then((properties) => res.status(200).json(properties))
            .catch((err) => res.status(500).json(err))
    });

    router.get('/:uuid', (req, res) => {
        let uuid = req.params["uuid"];
        retrieveApplicationUseCase.getApplications(db, {_id: ObjectId(uuid)})
            .then((properties) => res.status(200).json(properties))
            .catch((err) => res.status(500).json(err))
    });

    router.put('/:uuid', (req, res) => {
        let uuid = req.params["uuid"];
        createApplicationUseCase.validatePayload(req.data)
            .then(() => {
                retrieveApplicationUseCase.modifyListing(db, uuid, req.body)
                    .then(() => res.status(200).send())
                    .catch((err) => res.status(500).json(err))
            })
            .catch((err) => res.status(400).json(err))

    });

    router.delete('/:uuid', (req, res) => {
        let uuid = req.params["uuid"];
        retrieveApplicationUseCase.deleteApplication(db, uuid)
            .then((property) => res.status(200).json(property))
            .catch((err) => res.status(500).json(err))
    });

    return router;
};