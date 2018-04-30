let express = require('express');
let router = express.Router();
let ObjectId = require('mongodb').ObjectID;

let createListingUseCase = require('../../../models/use_cases/listing/rental_creation');
let retrieveListingUseCase = require('../../../models/use_cases/listing/rental_retrieval');
let retrieveLandlordUseCase = require('../../../models/use_cases/landlord/landlord_account_retrieval');
let filterHousesUseCase = require("../../../models/use_cases/common/filter");

module.exports = (db, col) => {
    const landlordCol = col["landlords"];
    const listingsCol = col["listings"];

    router.post('/', (req, res) => {
        let payload = req.body;

        createListingUseCase.validatePayload(payload)
            .then(() => retrieveLandlordUseCase.doesLandlordExist(db, landlordCol, payload["landlord_uuid"]))
            .then(() => retrieveLandlordUseCase.isLandlordIdentityVerified(db, landlordCol, payload["landlord_uuid"]))
            .then(() => retrieveLandlordUseCase.isLandlordPhoneVerified(db, landlordCol, payload["landlord_uuid"]))
            .then(() => createListingUseCase.validatePropertyIsUnique(db, listingsCol, payload["address"]))
            .then(() => createListingUseCase.createListing(db, listingsCol, payload))
            .then((data) => res.status(201).json(data))
            .catch((err) => {
                switch (err.message) {
                    case "bad_request":
                    case "property_not_unique":
                        res.status(400).send();
                        break;
                    case "non_existent_landlord":
                        res.status(401).send();
                        break;
                    case "unverified_phone":
                    case "unverified_identity":
                        res.status(403).send();
                        break;
                    default:
                        res.status(500).send();
                        break;
                }
            })
    });

    router.get('/', (req, res) => {
        let hiddenFields = req.headers["restricted"] ? {
            "address.apartment_number": false,
            "address.house_number": false,
            "address.eircode": false
        } : {};
        retrieveListingUseCase.getListings(db, listingsCol, {type: "rental"}, hiddenFields)
            .then((properties) => res.status(200).json(properties))
            .catch((err) => res.status(500).json(err))
    });

    router.get('/filter', (req, res) => {
        let query = {};
        filterHousesUseCase.transformQuery(req.query)
            .then((transformedQuery) => {
                query = transformedQuery;
                return filterHousesUseCase.validateFilters(query);
            })
            .then(() => filterHousesUseCase.getQueryString(query))
            .then((queryString) => filterHousesUseCase.filterListings(db, col["listings"], queryString))
            .then((listings) => res.status(200).json(listings))
            .catch((err) => {
                console.log(err);
                res.status(400).send();
            })
    });

    router.get('/:uuid', (req, res) => {
        let uuid = ObjectId(req.params["uuid"]);
        let hiddenFields = req.headers["restricted"] ? {
            "address.apartment_number": false,
            "address.house_number": false,
            "address.eircode": false
        } : {};
        retrieveListingUseCase.doesListingExist(db, listingsCol, {_id: uuid})
            .then(() => retrieveListingUseCase.getListings(db, listingsCol, {_id: uuid}, hiddenFields))
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

    router.patch('/:uuid', (req, res) => {
        let uuid = req.params["uuid"];
        createListingUseCase.validatePayload(req.body)
            .then(() => retrieveListingUseCase.doesListingExist(db, listingsCol, uuid))
            .then(() => retrieveLandlordUseCase.doesLandlordOwnListing(db, req.headers, landlordCol, listingsCol, uuid))
            .then(() => retrieveListingUseCase.modifyListing(db, listingsCol, req.body, uuid))
            .then(() => res.status(200).send())
            .catch((err) => {
                switch (err.message) {
                    case "bad_request":
                        res.status(400).send();
                        break;
                    case "wrong_landlord_account":
                        res.status(401).send();
                        break;
                    case "non_existent_listing":
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
        retrieveListingUseCase.doesListingExist(db, listingsCol, {_id: ObjectId(uuid)})
            .then(() => retrieveLandlordUseCase.doesLandlordOwnListing(db, req.headers, landlordCol, listingsCol, uuid))
            .then(() => retrieveListingUseCase.deleteListing(db, listingsCol, uuid))
            .then((property) => res.status(200).json(property))
            .catch((err) => {
                switch (err.message) {
                    case "wrong_landlord_account":
                        res.status(401).send();
                        break;
                    case "non_existent_listing":
                        res.status(404).send();
                        break;
                    default:
                        res.status(500).send();
                        break;
                }
            })
    });

    return router;
};