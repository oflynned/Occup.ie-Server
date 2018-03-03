let record = require("../common/record");

function doesUserExist(db, collection, filter) {
    return new Promise((res, rej) => {
        record.getRecords(db, collection, filter)
            .then((records) => records.length > 0 ? res() : rej())
            .catch((err) => new Error("User doesn't exist"))
    })
}

function getUsers(db, collection, filter = {}) {
    return record.getRecords(db, collection, filter)
}

function modifyUser(db, collection, data, id) {
    return record.modifyRecord(db, collection, data, id)
}

function deleteUser(db, collection, id) {
    return record.deleteRecord(db, collection, id)
}

module.exports = {
    doesUserExist: doesUserExist,
    getUsers: getUsers,
    modifyUser: modifyUser,
    deleteUser: deleteUser
};