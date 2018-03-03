let ObjectId = require('mongodb').ObjectID;

function getListings(db, collection, filter = {}) {
    return new Promise((res, rej) => {
        db.get(collection)
            .find(filter)
            .then((properties) => res(properties))
            .catch((err) => rej(err))
    })
}

function modifyListing(db, collection, id, data) {
    return new Promise((res, rej) => {
        db.get(collection)
            .update({_id: ObjectId(id)}, {"$set": data})
            .then(() => {
                res(data)
            })
            .catch((err) => rej(err));
    })
}

function deleteListing(db, collection, id) {
    return new Promise((res, rej) => {
        db.get(collection)
            .remove({_id: ObjectId(id)})
            .then((record) => res(record))
            .catch((err) => rej(err))
    })
}

module.exports = {
    getListings: getListings,
    modifyListing: modifyListing,
    deleteListing: deleteListing
};