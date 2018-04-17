let record = require("../common/record");

module.exports = {
    doesUserExist: function (db, collection, filter) {
        return new Promise((res, rej) => {
            record.getRecords(db, collection, filter)
                .then((records) => records.length > 0 ? res(records[0]) : rej(new Error("non_existent_user")))
                .catch((err) => rej(err))
        })
    },

    getUsers: function (db, collection, filter = {}) {
        return record.getRecords(db, collection, filter)
    },

    modifyUser: function (db, collection, data, id) {
        return record.modifyRecord(db, collection, data, id)
    },

    deleteUser: function (db, collection, id) {
        return record.deleteRecord(db, collection, id)
    }
};