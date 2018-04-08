let express = require('express');
let router = express.Router();

let ObjectId = require("mongodb").ObjectId;
let createLandlordUseCase = require("../../../models/use_cases/landlord/landlord_account_creation");
let retrieveLandlordUseCase = require("../../../models/use_cases/landlord/landlord_account_retrieval");

module.exports = (db, col) => {
    const collection = col["landlords"];

    router.post("/", (req, res) => {
        createLandlordUseCase.validatePayload(req.body)
            .then(() => createLandlordUseCase.createAccount(db, collection, req.body))
            .then((data) => res.status(201).json(data))
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

    router.get("/", (req, res) => {
        retrieveLandlordUseCase.getLandlords(db, collection)
            .then((landlords) => res.status(200).json(landlords))
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
        retrieveLandlordUseCase.doesLandlordExist(db, collection, {_id: ObjectId(uuid)})
            .then(() => retrieveLandlordUseCase.getLandlords(db, collection, {_id: ObjectId(uuid)}))
            .then((landlords) => res.status(200).json(landlords[0]))
            .catch((err) => {
                switch (err.message) {
                    case "bad_request":
                        res.status(400).send();
                        break;
                    case "non_existent_landlord":
                        res.status(404).send();
                        break;
                    default:
                        res.status(500).send();
                        break;
                }
            })
    });

    router.patch('/:uuid', (req, res) => {
        let uuid = req.params["uuid"];
        createLandlordUseCase.validatePayload(req.body)
            .then(() => retrieveLandlordUseCase.doesLandlordExist(db, collection, {_id: ObjectId(uuid)}))
            .then(() => retrieveLandlordUseCase.modifyLandlord(db, collection, req.body, uuid))
            .then((landlord) => res.status(200).json(landlord))
            .catch((err) => {
                switch (err.message) {
                    case "bad_request":
                        res.status(400).send();
                        break;
                    case "non_existent_landlord":
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
        retrieveLandlordUseCase.deleteLandlord(db, collection, uuid)
            .then((landlord) => res.status(200).json(landlord))
            .catch((err) => {
                switch (err.message) {
                    case "bad_request":
                        res.status(400).send();
                        break;
                    case "non_existent_landlord":
                        res.status(404).send();
                        break;
                    default:
                        res.status(500).send();
                        break;
                }
            })
    });


    return router;
}
;
