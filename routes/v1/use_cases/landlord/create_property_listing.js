let propertyModel = require('../../models/property');

function validatePayload(data) {
    let result = propertyModel.validate(data);
    return {
        valid: result["error"] !== true,
        result: result
    }
}

function validateKeys(keysList, comparatorObject) {
    return keysList === Object.keys(comparatorObject)
}

function createListing(db, data) {
    return new Promise((res, rej) => {
        db.get('properties')
            .insert(data)
            .then((property) => res(property))
            .catch((err) => rej(err))
    })
}

function saveImages() {

}

function compressImages() {

}

module.exports = {
    validatePayload: validatePayload,
    createListing: createListing
};