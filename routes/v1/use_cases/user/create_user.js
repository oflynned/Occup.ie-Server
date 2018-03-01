const collection = require("../../common/collections").landlords;
let landlord = require("../../models/landlord");
let record = require("../common/create_record");

function validatePayload(data) {
    return landlord.validate(data)
}

function generateLandlord() {
    return landlord.generate("John", "Smith")
}

function createAccount(db, data) {
    return record.createRecord(db, data, collection)
}

module.exports = {
    validatePayload: validatePayload,
    generateLandlord: generateLandlord,
    createAccount: createAccount
};