let express = require('express');
let router = express.Router();

let fs = require('fs');
let path = require('path');
let uuid = require('uuid');

let createPropertyUseCase = require('../use_cases/landlord/create_property_listing');

module.exports = function (db) {
    router.post('/', (req, res) => {
        let payload = req.body;
        let payloadValidation = createPropertyUseCase.validatePayload(payload);

        if (!payloadValidation["valid"]) {
            res.status(400);
            res.json(payloadValidation["result"])
        }

        createPropertyUseCase.createListing(db, payload)
            .then((property) => {
                res.status(201);
                res.json(property)
            })
            .catch((err) => {
                res.status(500);
                res.json(err);
            })
    });

    router.get('/', (req, res) => {
        let collection = db.get('properties');
        collection.find()
            .then((properties) => {
                res.status(200).json(properties);
            })
            .catch((err) => {
                res.status(500).json(err);
            })
    });

    router.get('/:uuid', (req, res) => {
        let uuid = req.params["uuid"];

    });

    router.get('/filter', (req, res) => {

    });

    router.put('/:uuid', (req, res) => {

    });

    router.delete('/:uuid', (req, res) => {

    });

    return router;
};