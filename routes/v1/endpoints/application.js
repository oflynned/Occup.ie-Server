let express = require('express');
let router = express.Router();
let ObjectId = require('mongodb').ObjectID;

let createApplicationUseCase = require('../../../models/use_cases/application/application_creation');
let retrieveApplicationUseCase = require('../../../models/use_cases/application/application_retrieval');
let retrieveLandlordUseCase = require('../../../models/use_cases/landlord/landlord_account_retrieval');
let retrieveListingUseCase = require('../../../models/use_cases/listing/house_share_retrieval');
let retrieveUserUseCase = require('../../../models/use_cases/user/user_account_retrieval');

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
            .then((application) => res.status(201).json(application))
            .catch((err) => {
                switch (err.message) {
                    case "unknown_listing_type":
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
        retrieveApplicationUseCase.validateQuery(req.query)
            .then((query) => retrieveApplicationUseCase.getApplications(db, applicationCol, query))
            .then((applications) => res.status(200).json(applications))
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
        retrieveApplicationUseCase.doesApplicationExist(db, applicationCol, {_id: ObjectId(uuid)})
            .then(() => retrieveApplicationUseCase.getApplications(db, applicationCol, {_id: ObjectId(uuid)}))
            .then((properties) => res.status(200).json(properties))
            .catch((err) => {
                switch (err.message) {
                    case "bad_request":
                        res.status(400).send();
                        break;
                    case "non_existent_application":
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
        createApplicationUseCase.validatePayload(req.body)
            .then(() => retrieveApplicationUseCase.doesApplicationExist(db, applicationCol, uuid))
            .then(() => retrieveApplicationUseCase.modifyApplication(db, applicationCol, req.body, uuid))
            .then((application) => res.status(200).json(application))
            .catch((err) => {
                switch (err.message) {
                    case "bad_request":
                        res.status(400).send();
                        break;
                    case "non_existent_application":
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
        retrieveApplicationUseCase.doesApplicationExist(db, applicationCol, {_id: ObjectId(uuid)})
            .then(() => retrieveApplicationUseCase.deleteApplication(db, applicationCol, uuid))
            .then((property) => res.status(200).json(property))
            .catch((err) => {
                switch (err.message) {
                    case "bad_request":
                        res.status(400).send();
                        break;
                    case "non_existent_application":
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