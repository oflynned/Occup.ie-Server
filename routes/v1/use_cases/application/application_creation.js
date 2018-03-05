let ObjectId = require('mongodb').ObjectID;
const collection = require("../../../../config/collections").applications;

module.exports = {
    getApplications: function (db, filter = {}) {
        return new Promise((res, rej) => {
            db.get(collection)
                .find(filter)
                .then((records) => res(records))
                .catch((err) => rej(err))
        })
    },

    modifyApplication: function (db, id, data) {
        return new Promise((res, rej) => {
            db.get(collection)
                .update({_id: ObjectId(id)}, {"$set": data})
                .then(() => {
                    res(data)
                })
                .catch((err) => rej(err));
        })
    },

    deleteApplication: function (db, id) {
        return new Promise((res, rej) => {
            db.get(collection)
                .remove({_id: ObjectId(id)})
                .then((record) => res(record))
                .catch((err) => rej(err))
        })
    }
};