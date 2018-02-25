const collection = require("../../common/collections").listings;
let propertyModel = require('../../models/property');

function validatePayload(data) {
    return new Promise((res, rej) => {
        let result = propertyModel.validate(data);
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
    return new Promise((res, rej) => {
        db.get(collection)
            .insert(data)
            .then((property) => res(property))
            .catch((err) => rej(err))
    })
}

module.exports = {
    validatePayload: validatePayload,
    validatePropertyIsUnique: validatePropertyIsUnique,
    createListing: createListing
};