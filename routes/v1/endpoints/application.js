let express = require('express');
let router = express.Router();
let ObjectId = require('mongodb').ObjectID;

let createApplicationUseCase = require('../use_cases/application/application_creation');
let retrieveApplicationUseCase = require('../use_cases/application/application_retrieval');
let retrieveLandlordUseCase = require('../use_cases/landlord/landlord_account_retrieval');
let retrieveListingUseCase = require('../use_cases/listing/listing_retrieval');
let retrieveUserUseCase = require('../use_cases/user/user_account_retrieval');

module.exports = (db, col) => {
    const userCol = col["users"];
    const listingsCol = col["listings"];
    const landlordCol = col["landlords"];
    const applicationCol = col["applications"];

    router.post('/', (req, res) => {
        let application = req.body;

        createApplicationUseCase.validatePayload(application)
            .then(() => retrieveListingUseCase.doesListingExist(db, listingsCol, {_id: ObjectId(application["listing_id"])}))
            .then(() => retrieveLandlordUseCase.doesLandlordExist(db, landlordCol, {_id: ObjectId(application["landlord_id"])}))
            .then(() => retrieveUserUseCase.doesUserExist(db, userCol, {_id: ObjectId(application["user_id"])}))
            .then(() => retrieveListingUseCase.validateListingIsOpen(db, listingsCol, {_id: application["listing_id"]}))
            .then(() => retrieveListingUseCase.validateListingIsFitting(db, userCol, listingsCol, application))
            .then(() => createApplicationUseCase.validateApplicationIsUnique(db, applicationCol, application))
            .then(() => createApplicationUseCase.createApplication(db, applicationCol, application))
            .then((data) => res.status(201).json(data))
            .catch((err) => {
                console.error(err);
                switch (err.message) {
                    case "bad_request":
                        res.status(400).send();
                        break;
                    case "unfitting_candidate":
                        res.status(403).send();
                        break;
                    case "non_existent_landlord":
                    case "non_existent_listing":
                    case "non_existent_user":
                        res.status(404).send();
                        break;
                    case "non_applicable_listing":
                    case "non_unique_application":
                    default:
                        res.status(500).send();
                        break;
                }
            })
    });

    router.get('/', (req, res) => {
        retrieveApplicationUseCase.getApplications(db)
            .then((properties) => res.status(200).json(properties))
            .catch((err) => {
                console.error(err);
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
        retrieveApplicationUseCase.getApplications(db, applicationCol, {_id: ObjectId(uuid)})
            .then((properties) => res.status(200).json(properties))
            .catch((err) => {
                console.error(err);
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

    router.put('/:uuid', (req, res) => {
        let uuid = req.params["uuid"];
        createApplicationUseCase.validatePayload(req.data)
            .then(() => retrieveApplicationUseCase.modifyListing(db, applicationCol, req.body, uuid))
            .then(() => res.status(200).send())
            .catch((err) => {
                console.error(err);
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
        retrieveApplicationUseCase.deleteApplication(db, applicationCol, uuid)
            .then((property) => res.status(200).json(property))
            .catch((err) => {
                console.error(err);
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

    return router;
};