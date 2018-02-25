function validatePayload(data) {
    let keyValidation = validateKeys(["type", "address"], data);
    let addressKeyValidation = validateKeys(["house_number", "street", "area", "city", "county", "eircode"], data["address"]);
    return keyValidation && addressKeyValidation;
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