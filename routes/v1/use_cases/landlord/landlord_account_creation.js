let landlord = require("../../models/landlord");
let record = require("../common/record");

module.exports = {
    validatePayload: function (data) {
        return new Promise((res, rej) => {
            let results = landlord.validate(data);
            results["error"] === null ? res() : rej(new Error("bad_request"));
        })
    },

    generateLandlordObject: function (payload) {
        return {
            forename: payload["forename"],
            surname: payload["surname"],
            dob: payload["dob"],
            email: payload["email"],
            phone_number: payload["phone_number"],
            phone_verified: payload["phone_verified"],
            identity_verified: payload["identity_verified"],
            profile_picture: payload["profile_picture"],
            creation_time: payload["creation_time"]
        };
    },

    createAccount: function (db, collection, data) {
        return record.createRecord(db, collection, data)
    }
};