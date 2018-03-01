const collection = require("../../common/collections").applications;
let application = require("../../models/application");
let record = require("../common/create_record");

function validatePayload(data) {
    return new Promise((res, rej) => {
        let results = application.validate(data);
        results["error"] === null ? res() : rej(results["error"]);
    })
}

function validateApplicationIsUnique(db, data) {
    return new Promise((res, rej) => {
        db.get(collection)
            .find({
                user_id: data["user_id"],
                landlord_id: data["landlord_id"],
                listing_id: data["listing_id"],
            })
            .then((users) => {
                if (users.length === 0)
                    res();
                else
                    throw new Error("Application is not unique");
            })
            .catch((err) => rej(err))
    })
}

function generateApplicationObject(payload) {
    return new Promise((res, rej) => {
        res({
            user_id: payload["user_id"],
            landlord_id: payload["landlord_id"],
            listing_id: payload["listing_id"],
            status: payload["status"]
        })
    });
}

function getApplicationParams(application, updatedApplication) {
    application["user_id"] = updatedApplication["user_id"] === undefined ? application["user_id"] : updatedApplication["user_id"];
    application["landlord_id"] = updatedApplication["landlord_id"] === undefined ? application["landlord_id"] : updatedApplication["landlord_id"];
    application["listing_id"] = updatedApplication["listing_id"] === undefined ? application["listing_id"] : updatedApplication["listing_id"];
    application["status"] = updatedApplication["status"] === undefined ? application["status"] : updatedApplication["status"];

    validatePayload(application);
    return application;
}

function createApplication(db, data) {
    return record.createRecord(db, data, collection)
}

module.exports = {
    validatePayload: validatePayload,
    validateApplicationIsUnique: validateApplicationIsUnique,
    generateApplicationObject: generateApplicationObject,
    getApplicationParams: getApplicationParams,
    createApplication: createApplication
};