let ObjectId = require('mongodb').ObjectID;
const collection = require("../../common/collections").users;

function getUsers(db, filter = {}) {
    return new Promise((res, rej) => {
        db.get(collection)
            .find(filter)
            .then((records) => res(records))
            .catch((err) => rej(err))
    })
}

function modifyUser(db, id, data) {
    return new Promise((res, rej) => {
        db.get(collection)
            .update({_id: ObjectId(id)}, {"$set": data})
            .then(() => res(data))
            .catch((err) => rej(err));
    })
}

function deleteUser(db, id) {
    return new Promise((res, rej) => {
        db.get(collection)
            .remove({_id: ObjectId(id)})
            .then((record) => res(record))
            .catch((err) => rej(err))
    })
}

module.exports = {
    getUsers: getUsers,
    modifyUser: modifyUser,
    deleteUser: deleteUser
};