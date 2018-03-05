let listingModel = require('../../models/listing');
let record = require("../common/record");

function validatePayload(data) {
    return new Promise((res, rej) => {
        let result = listingModel.validate(data);
        result["error"] === null ? res() : rej(new Error("bad_request"))
    })
}

function validatePropertyIsUnique(db, collection, address) {
    return new Promise((res, rej) => {
        db.get(collection)
            .find({address: address})
            .then((properties) => properties.length === 0 ? res() : rej(new Error("property_not_unique")))
            .catch((err) => rej(err))
    })
}

function createListing(db, collection, data) {
    return record.createRecord(db, collection, data);
}

module.exports = {
    validatePayload: validatePayload,
    validatePropertyIsUnique: validatePropertyIsUnique,
    createListing: createListing
};