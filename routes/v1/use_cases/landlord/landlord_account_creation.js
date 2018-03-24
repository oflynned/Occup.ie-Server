let landlord = require("../../models/landlord");
let record = require("../common/record");

module.exports = {
    validatePayload: function (data) {
        return new Promise((res, rej) => {
            let results = landlord.validate(data);
            results["error"] === null ? res() : rej(new Error("bad_request"));
        })
    },

    createAccount: function (db, collection, data) {
        return record.createRecord(db, collection, data)
    }
};