let record = require("../common/record");

module.exports = {
    doesListingExist: function (db, collection, filter) {
        return new Promise((res, rej) => {
            record.getRecords(db, collection, filter)
                .then((records) => records.length > 0 ? res() : rej(new Error("non_existent_listing")))
                .catch((err) => rej(err))
        })
    },

    getListings: function (db, collection, filter = {}) {
        return record.getRecords(db, collection, filter)
    },

    modifyListing: function (db, collection, data, id) {
        return record.modifyRecord(db, collection, data, id)
    },

    deleteListing: function (db, collection, id) {
        return record.deleteRecord(db, collection, id)
    }
};