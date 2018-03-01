const collection = require("../../common/collections").listings;
let listingModel = require('../../models/listing');
let record = require("../common/create_record");

function validatePayload(data) {
    return new Promise((res, rej) => {
        let result = listingModel.validate(data);
        result["error"] === null ? res() : rej(result["error"])
    })
}

function validatePropertyIsUnique(db, data) {
    return new Promise((res, rej) => {
        db.get(collection)
            .find({address: data})
            .then((properties) => {
                if (properties.length === 0)
                    res();
                else
                    throw new Error("Property is not unique");
            })
            .catch((err) => rej(err))
    })
}

function createListing(db, data) {
    return record.createRecord(db, data, collection);
}

module.exports = {
    validatePayload: validatePayload,
    validatePropertyIsUnique: validatePropertyIsUnique,
    createListing: createListing
};