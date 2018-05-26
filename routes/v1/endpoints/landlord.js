let express = require('express');
let router = express.Router();

let ObjectId = require("mongodb").ObjectId;

let createLandlordUseCase = require("../../../models/use_cases/landlord/landlord_account_creation");
let retrieveLandlordUseCase = require("../../../models/use_cases/landlord/landlord_account_retrieval");
let retrieveRentalUseCase = require("../../../models/use_cases/listing/rental_retrieval");
let retrieveHouseShareUseCase = require("../../../models/use_cases/listing/house_share_retrieval");
let sortListingsUseCase = require("../../../models/use_cases/listing/listing_sorting");

module.exports = (db, col) => {
    const landlordCol = col["landlords"];
    const listingsCol = col["listings"];

    router.post("/", (req, res) => {
        createLandlordUseCase.validatePayload(req.body)
            .then(() => createLandlordUseCase.validateLandlordAge(req.body))
            .then(() => createLandlordUseCase.validateLandlordIsUnique(db, landlordCol, req.body))
            .then(() => {
                let filter = {"oauth.oauth_id": req.body["oauth"]["oauth_id"]};
                return retrieveLandlordUseCase.getLandlords(db, landlordCol, filter);
            })
            .then((landlords) => {
                if (landlords.length === 0) {
                    return createLandlordUseCase.createAccount(db, landlordCol, req.body)
                        .then((data) => res.status(201).json(data))
                } else {
                    res.status(200).json(landlords[0])
                }
            })
            .catch((err) => {
                switch (err.message) {
                    case "bad_request":
                        res.status(400).send();
                        break;
                    case "underage_landlord":
                        res.status(403).json(err);
                        break;
                    default:
                        res.status(500).send();
                        break;
                }
            })
    });

    router.get("/", (req, res) => {
        retrieveLandlordUseCase.getLandlords(db, landlordCol)
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

    router.get("/me", (req, res) => {
        retrieveLandlordUseCase.doesLandlordExist(db, landlordCol, {"oauth.oauth_id": req.headers["oauth_id"]})
            .then((landlord) => res.status(200).json({"_id": landlord["_id"]}))
            .catch((err) => res.status(404).send(err))
    });

    router.get('/:uuid', (req, res) => {
        let uuid = req.params["uuid"];
        retrieveLandlordUseCase.doesLandlordExist(db, landlordCol, {_id: ObjectId(uuid)})
            .then(() => retrieveLandlordUseCase.getLandlords(db, landlordCol, {_id: ObjectId(uuid)}))
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

    router.get('/:uuid/listings', (req, res) => {
        let uuid = req.params["uuid"];


        // TODO use filter {landlord_uuid: ObjectId(uuid)}
        retrieveLandlordUseCase.doesLandlordExist(db, landlordCol, {_id: ObjectId(uuid)})
            .then(() => retrieveHouseShareUseCase.getListings(db, listingsCol, {}))
            .then((houseShares) => sortListingsUseCase.sortListings(houseShares))
            .then((listings) => res.status(200).json(listings))
            .catch((err) => {
                switch (err.message) {
                    case "non_existent_landlord":
                        res.status(404);
                        break;
                    default:
                        console.log(err);
                        res.status(500).send(err);
                        break;
                }
            })
    });

    router.patch('/:uuid', (req, res) => {
        let uuid = req.params["uuid"];
        createLandlordUseCase.validatePayload(req.body)
            .then(() => retrieveLandlordUseCase.doesLandlordExist(db, landlordCol, {_id: ObjectId(uuid)}))
            .then(() => retrieveLandlordUseCase.modifyLandlord(db, landlordCol, req.body, uuid))
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
        retrieveLandlordUseCase.deleteLandlord(db, landlordCol, uuid)
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
