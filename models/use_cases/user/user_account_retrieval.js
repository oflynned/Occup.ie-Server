let record = require("../common/record");
let userAccountCreationUseCase = require("../../use_cases/user/user_account_creation");
let ObjectId = require("mongodb").ObjectId;

module.exports = {
    doesUserExist: function (db, collection, filter) {
        return new Promise((res, rej) => {
            record.getRecords(db, collection, filter)
                .then((records) => records.length > 0 ? res(records[0]) : rej(new Error("non_existent_user")))
                .catch((err) => rej(err))
        })
    },

    getUserFromHeader: function (req, db, collection) {
        if (req.headers["restricted"]) {
            return Promise.resolve({})
        } else {
            return record.getRecords(db, collection, {"_id": ObjectId(req.headers["uuid"])})
        }
    },

    getUserFilterDetails: function (req, db, collection) {
        if (req.headers["restricted"]) {
            return Promise.resolve({})
        } else {
            return new Promise((res, rej) => {
                record.getRecords(db, collection, {"_id": ObjectId(req.headers["uuid"])})
                    .then((user) => {
                        res({
                            age: userAccountCreationUseCase.getUserAge(user[0]["details"]["dob"]),
                            sex: user[0]["details"]["sex"],
                            profession: user[0]["details"]["profession"]
                        })
                    })
                    .catch((err) => rej(err))
            })
        }
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