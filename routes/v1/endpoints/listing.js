let express = require('express');
let router = express.Router();

let createListingUseCase = require('../use_cases/landlord/create_listing');
let retrieveListingUseCase = require('../use_cases/landlord/retrieve_listing');

module.exports = (db) => {
    router.post('/', (req, res) => {
        let payload = req.body;
        createListingUseCase.validatePayload(payload)
            .then(() => createListingUseCase.validatePropertyIsUnique(db, payload["address"]))
            .then(() => createListingUseCase.createListing(db, payload))
            .then((data) => res.status(201).json(data))
            .catch((err) => res.status(400).send(err))
    });

    router.get('/', (req, res) => {
        retrieveListingUseCase.getListings(db)
            .then((properties) => res.status(200).json(properties))
            .catch((err) => res.status(500).json(err))
    });

    router.get('/:uuid', (req, res) => {
        let uuid = req.params["uuid"];
        retrieveListingUseCase.getListings(db, uuid)
            .then((properties) => res.status(200).json(properties))
            .catch((err) => res.status(500).json(err))
    });

    router.put('/:uuid', (req, res) => {
        let uuid = req.params["uuid"];
        retrieveListingUseCase.modifyListing(db, uuid, req.body)
            .then(() => res.status(200).send())
            .catch((err) => res.status(500).send(err))
    });

    router.delete('/:uuid', (req, res) => {
        let uuid = req.params["uuid"];
        retrieveListingUseCase.deleteListing(db, uuid)
            .then((property) => res.status(200).send(property))
            .catch((err) => res.status(500).send(err))
    });

    return router;
};