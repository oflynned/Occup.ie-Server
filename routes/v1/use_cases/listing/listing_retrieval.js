let ObjectId = require('mongodb').ObjectID;

module.exports = {
    getListings: function (db, collection, filter = {}) {
        return new Promise((res, rej) => {
            db.get(collection)
                .find(filter)
                .then((properties) => res(properties))
                .catch((err) => rej(err))
        })
    },

    modifyListing: function (db, collection, id, data) {
        return new Promise((res, rej) => {
            db.get(collection)
                .update({_id: ObjectId(id)}, {"$set": data})
                .then(() => res(data))
                .catch((err) => rej(err));
        })
    },

    deleteListing: function (db, collection, id) {
        return new Promise((res, rej) => {
            db.get(collection)
                .remove({_id: ObjectId(id)})
                .then((record) => res(record))
                .catch((err) => rej(err))
        })
    }
};