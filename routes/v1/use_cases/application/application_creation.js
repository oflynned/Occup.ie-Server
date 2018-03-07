let application = require("../../models/application");
let record = require("../common/record");

module.exports = {
    validateApplicationIsUnique: function (db, collection, data) {
        return new Promise((res, rej) => {
            let query = {
                user_id: data["user_id"],
                landlord_id: data["landlord_id"],
                listing_id: data["listing_id"]
            };

            record.getRecords(db, collection, query)
                .then((listings) => listings.length === 0 ? res() : rej(new Error("non_unique_application")))
        })
    },

    validateApplicationIsFitting: function (db, collection, data) {
        return new Promise((res, rej) => {
            let query = {
                user_id: data["user_id"],
                landlord_id: data["landlord_id"],
                listing_id: data["listing_id"]
            };

            record.getRecords(db, collection, query)
                .then((listings) => {
                    if (listings.length === 0)
                        rej(new Error("non_existent_application"))

                })
        })
    },

    validateListingIsOpen: function () {
        // TODO
    },

    generateApplicationObject: function (db, collection, payload) {
        return {
            user_id: payload["user_id"],
            landlord_id: payload["landlord_id"],
            listing_id: payload["listing_id"],
            status: "pending"
        };
    },

    createApplication: function (db, collection, data) {
        return record.createRecord(db, collection, data)
    },

    validatePayload: function (data) {
        return new Promise((res, rej) => {
            let results = application.validate(data);
            results["error"] === null ? res() : rej(new Error("bad_request"));
        })
    }
};