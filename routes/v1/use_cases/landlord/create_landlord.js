const collection = require("../../common/collections").landlords;
let landlord = require("../../models/landlord");
let record = require("../common/create_record");

function validatePayload(data) {
    return landlord.validate(data)
}

function generateLandlord() {
    return landlord.generate("John", "Smith")
}

function generateLandlordObject(payload) {
    return new Promise((res, rej) => {
        res({
            forename: payload["forename"],
            surname: payload["surname"],
            email: payload["email"],
            phone_number: payload["facebook_id"],
            profile_picture: payload["profile_picture"]
        })
    });
}

function getLandlordParams(landlord, updatedLandlord) {
    landlord["forename"] = updatedLandlord["forename"] === undefined ? landlord["forename"] : updatedLandlord["forename"];
    landlord["surname"] = updatedLandlord["surname"] === undefined ? landlord["surname"] : updatedLandlord["surname"];
    landlord["email"] = updatedLandlord["email"] === undefined ? landlord["email"] : updatedLandlord["email"];
    landlord["phone_number"] = updatedLandlord["phone_number"] === undefined ? landlord["phone_number"] : updatedLandlord["phone_number"];
    landlord["profile_picture"] = updatedLandlord["profile_picture"] === undefined ? landlord["profile_picture"] : updatedLandlord["profile_picture"];

    validatePayload(landlord);
    return landlord;
}

function createAccount(db, data) {
    return record.createRecord(db, data, collection)
}

module.exports = {
    validatePayload: validatePayload,
    generateLandlord: generateLandlord,
    getLandlordParams: getLandlordParams,
    generateLandlordObject: generateLandlordObject,
    createAccount: createAccount
};