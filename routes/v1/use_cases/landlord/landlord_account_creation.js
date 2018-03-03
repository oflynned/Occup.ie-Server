let landlord = require("../../models/landlord");
let record = require("../common/record");

function validatePayload(data) {
    return landlord.validate(data)
}

function generateLandlordObject(payload) {
    return {
        forename: payload["forename"],
        surname: payload["surname"],
        email: payload["email"],
        phone_number: payload["phone_number"],
        phone_verified: payload["phone_verified"],
        identity_verified: payload["identity_verified"],
        profile_picture: payload["profile_picture"]
    };
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

function createAccount(db, collection, data) {
    return record.createRecord(db, data, collection)
}

module.exports = {
    validatePayload: validatePayload,
    getLandlordParams: getLandlordParams,
    generateLandlordObject: generateLandlordObject,
    createAccount: createAccount
};