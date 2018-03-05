let landlord = require("../../models/landlord");
let record = require("../common/record");

module.exports = {
    validatePayload: function (data) {
        return new Promise((res, rej) => {
            let results = landlord.validate(data);
            results["error"] === null ? res() : rej(new Error("bad_request"));
        })
    },

    getLandlordParams: function (obj, newObj) {
        obj["forename"] = newObj["forename"] === undefined ? obj["forename"] : newObj["forename"];
        obj["surname"] = newObj["surname"] === undefined ? obj["surname"] : newObj["surname"];
        obj["profile_picture"] = newObj["profile_picture"] === undefined ? obj["profile_picture"] : newObj["profile_picture"];

        // TODO allow updating of phone number, but validation has to revert back to false

        landlord.validate(obj);
        return obj;
    },

    generateLandlordObject: function (payload) {
        return {
            forename: payload["forename"],
            surname: payload["surname"],
            email: payload["email"],
            phone_number: payload["phone_number"],
            phone_verified: payload["phone_verified"],
            identity_verified: payload["identity_verified"],
            profile_picture: payload["profile_picture"]
        };
    },

    createAccount: function (db, collection, data) {
        return record.createRecord(db, collection, data)
    }
};