let express = require('express');
let router = express.Router();
let ObjectId = require('mongodb').ObjectID;

let createListingUseCase = require('../use_cases/listing/listing_creation');
let retrieveListingUseCase = require('../use_cases/listing/listing_retrieval');

module.exports = (db, col) => {
    const collection = col["listings"];

    router.post('/', (req, res) => {
        let payload = req.body;
        createListingUseCase.validatePayload(payload)
            .then(() => createListingUseCase.validatePropertyIsUnique(db, collection, payload["address"]))
            .then(() => {
                createListingUseCase.createListing(db, payload)
                    .then((data) => res.status(201).json(data))
                    .catch((err) => res.status(500).json(err))
            })
            .catch((err) => res.status(400).json(err))
    });

    router.get('/', (req, res) => {
        retrieveListingUseCase.getListings(db, collection)
            .then((properties) => res.status(200).json(properties))
            .catch((err) => res.status(500).json(err))
    });

    router.get('/:uuid', (req, res) => {
        let uuid = req.params["uuid"];
        retrieveListingUseCase.getListings(db, collection, {_id: ObjectId(uuid)})
            .then((properties) => res.status(200).json(properties))
            .catch((err) => res.status(500).json(err))
    });

    router.put('/:uuid', (req, res) => {
        let uuid = req.params["uuid"];
        createListingUseCase.validatePayload(req.data)
            .then(() => {
                retrieveListingUseCase.modifyListing(db, collection, req.body, uuid)
                    .then(() => res.status(200).send())
                    .catch((err) => res.status(500).json(err))
            })
            .catch((err) => res.status(400).json(err))

    });

    router.delete('/:uuid', (req, res) => {
        let uuid = req.params["uuid"];
        retrieveListingUseCase.deleteListing(db, collection, uuid)
            .then((property) => res.status(200).json(property))
            .catch((err) => res.status(500).json(err))
    });

    return router;
};