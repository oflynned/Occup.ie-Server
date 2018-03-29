let model = require('../../house_share');
let record = require("../common/record");

module.exports = {
    validatePayload: function (data) {
        return new Promise((res, rej) => {
            let result = model.validate(data);
            result["error"] === null ? res() : rej(new Error("bad_request"))
        })
    },
    validatePropertyIsUnique: function (db, collection, address) {
        return new Promise((res, rej) => {
            db.get(collection)
                .find({address: address})
                .then((properties) => properties.length === 0 ? res() : rej(new Error("property_not_unique")))
                .catch((err) => rej(err))
        })
    },
    createListing: function (db, collection, data) {
        return record.createRecord(db, collection, data);
    }
};