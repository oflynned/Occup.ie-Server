let express = require('express');
let router = express.Router();
let ObjectId = require('mongodb').ObjectID;

let createListingUseCase = require('../use_cases/landlord/listing_creation');
let retrieveListingUseCase = require('../use_cases/common/listing_retrieval');

module.exports = (db) => {
    router.post('/', (req, res) => {
        let payload = req.body;
        createListingUseCase.validatePayload(payload)
            .then(() => createListingUseCase.validatePropertyIsUnique(db, payload["address"]))
            .then(() => {
                createListingUseCase.createListing(db, payload)
                    .then((data) => res.status(201).json(data))
                    .catch((err) => res.status(500).json(err))
            })
            .catch((err) => res.status(400).json(err))
    });

    router.get('/', (req, res) => {
        retrieveListingUseCase.getListings(db)
            .then((properties) => res.status(200).json(properties))
            .catch((err) => res.status(500).json(err))
    });

    router.get('/:uuid', (req, res) => {
        let uuid = req.params["uuid"];
        retrieveListingUseCase.getListings(db, {_id: ObjectId(uuid)})
            .then((properties) => res.status(200).json(properties))
            .catch((err) => res.status(500).json(err))
    });

    router.put('/:uuid', (req, res) => {
        let uuid = req.params["uuid"];
        createListingUseCase.validatePayload(req.data)
            .then(() => {
                retrieveListingUseCase.modifyListing(db, uuid, req.body)
                    .then(() => res.status(200).send())
                    .catch((err) => res.status(500).json(err))
            })
            .catch((err) => res.status(400).json(err))

    });

    router.delete('/:uuid', (req, res) => {
        let uuid = req.params["uuid"];
        retrieveListingUseCase.deleteListing(db, uuid)
            .then((property) => res.status(200).json(property))
            .catch((err) => res.status(500).json(err))
    });

    return router;
};