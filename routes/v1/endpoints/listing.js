let express = require('express');
let router = express.Router();
let ObjectId = require('mongodb').ObjectID;

let createListingUseCase = require('../use_cases/listing/listing_creation');
let retrieveListingUseCase = require('../use_cases/listing/listing_retrieval');

let createLandlordUseCase = require('../use_cases/landlord/landlord_account_creation');
let retrieveLandlordUseCase = require('../use_cases/landlord/landlord_account_retrieval');

module.exports = (db, col) => {
    const landlordCol = col["landlords"];
    const listingCol = col["listings"];

    router.post('/', (req, res) => {
        let payload = req.body;

        createListingUseCase.validatePayload(payload)
            .then(() => retrieveLandlordUseCase.doesLandlordExist(db, landlordCol, payload["landlord_uuid"]))
            .then(() => retrieveLandlordUseCase.isLandlordIdentityVerified(db, landlordCol, payload["landlord_uuid"]))
            .then(() => retrieveLandlordUseCase.isLandlordPhoneVerified(db, landlordCol, payload["landlord_uuid"]))
            .then(() => createListingUseCase.validatePropertyIsUnique(db, listingCol, payload["address"]))
            .then(() => createListingUseCase.createListing(db, listingCol, payload))
            .then((data) => res.status(201).json(data))
            .catch((err) => {
                switch (err.message) {
                    case "bad_request":
                    case "property_not_unique":
                        res.status(400).send();
                        break;
                    case "unverified_phone":
                    case "unverified_identity":
                    case "non_existent_landlord":
                        res.status(403).send();
                        break;
                    default:
                        res.status(500).send();
                        break;
                }
            })
    });

    router.get('/', (req, res) => {
        retrieveListingUseCase.getListings(db, listingCol)
            .then((properties) => res.status(200).json(properties))
            .catch((err) => res.status(500).json(err))
    });

    router.get('/:uuid', (req, res) => {
        let uuid = req.params["uuid"];
        retrieveListingUseCase.doesListingExist(db, listingCol, {_id: ObjectId(uuid)})
            .then(() => retrieveListingUseCase.getListings(db, listingCol, {_id: ObjectId(uuid)}))
            .then((properties) => res.status(200).json(properties))
            .catch((err) => {
                switch (err.message) {
                    case "non_existent_listing":
                        res.status(404).send();
                        break;
                    default:
                        res.status(500).send();
                        break;
                }
            })
    });

    router.put('/:uuid', (req, res) => {
        let uuid = req.params["uuid"];
        createListingUseCase.validatePayload(req.data)
            .then(() => retrieveListingUseCase.modifyListing(db, listingCol, req.body, uuid))
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
        retrieveListingUseCase.deleteListing(db, listingCol, uuid)
            .then((property) => res.status(200).json(property))
            .catch((err) => res.status(500).json(err))
    });

    return router;
}
;