let applicationModel = require("../../models/application");
let record = require("../common/record");
let ObjectId = require("mongodb").ObjectId;

module.exports = {
    doesApplicationExist: function(db, collection, filter) {
        return new Promise((res, rej) => {
            record.getRecords(db, collection, filter)
                .then((records) => records.length > 0 ? res() : rej(new Error("non_existent_application")))
                .catch((err) => rej(err))
        })
    },

    validateQuery: function (query) {
        return new Promise((res, rej) => {
            let result = applicationModel.validateQuery(query);
            if(result["error"] !== null) rej(new Error("bad_request"));

            // now groom params to give back an appropriate query
            let applicationsQuery = {};
            for(let k in query)
                applicationsQuery[k] = ObjectId(query[k])

            res(applicationsQuery);
        })
    },

    getApplications: function (db, collection, filter = {}) {
        return record.getRecords(db, collection, filter)
    },

    modifyApplication: function (db, collection, data, id) {
        return record.modifyRecord(db, collection, data, id)
    },

    deleteApplication: function (db, collection, id) {
        return record.deleteRecord(db, collection, id)
    }
};