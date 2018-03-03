let express = require('express');
let router = express.Router();

let ObjectId = require("mongodb").ObjectId;
let createLandlordUseCase = require("../use_cases/landlord/landlord_account_creation");
let retrieveLandlordUseCase = require("../use_cases/landlord/landlord_account_retrieval");

module.exports = (db, col) => {
    const collection = col["landlords"];

    router.post("/", (req, res) => {
        createLandlordUseCase.validatePayload(req.body)
            .then(() => {
                createLandlordUseCase.createAccount(db, collection, req.body)
                    .then((data) => res.status(201).json(data))
                    .catch((err) => res.status(500).json(err))
            })
            .catch((err) => res.status(400).json(err))
    });

    router.get("/", (req, res) => {
        retrieveLandlordUseCase.getLandlords(db, collection)
            .then((landlords) => res.status(200).json(landlords))
            .catch((err) => res.status(500).json(err))
    });

    router.get('/:uuid', (req, res) => {
        let uuid = req.params["uuid"];
        retrieveLandlordUseCase.doesLandlordExist(db, collection, {_id: ObjectId(uuid)})
            .then(() => {
                retrieveLandlordUseCase.getLandlords(db, collection, {_id: ObjectId(uuid)})
                    .then((landlords) => res.status(200).json(landlords[0]))
                    .catch((err) => res.status(500).json(err))
            })
            .catch((err) => res.status(404).json(err))
    });

    router.put('/:uuid', (req, res) => {
        let uuid = req.params["uuid"];
        createLandlordUseCase.validatePayload(req.body)
            .then(() => {
                retrieveLandlordUseCase.getLandlords(db, collection, {_id: ObjectId(uuid)})
                    .then((landlords) => createLandlordUseCase.getLandlordParams(landlords[0], req.body))
                    .then((landlord) => retrieveLandlordUseCase.modifyLandlord(db, collection, landlord, uuid))
                    .then((landlord) => res.status(200).json(landlord))
                    .catch((err) => res.status(500).json(err))
            })
            .catch((err) => res.status(400).json(err))
    });

    router.delete('/:uuid', (req, res) => {
        let uuid = req.params["uuid"];
        retrieveLandlordUseCase.deleteLandlord(db, collection, uuid)
            .then((landlord) => res.status(200).json(landlord))
            .catch((err) => res.status(500).json(err))
    });


    return router;
};
