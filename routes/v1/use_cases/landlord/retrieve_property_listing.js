let ObjectId = require('mongodb').ObjectID;

const COLLECTION = "properties";

function getListings(db, id) {
    let searchFilter = id === undefined ? {} : {_id: ObjectId(id)};
    return new Promise((res, rej) => {
        db.get(COLLECTION)
            .find(searchFilter)
            .then((properties) => res(properties))
            .catch((err) => rej(err))
    })
}

function modifyListing(db, id, data) {
    return new Promise((res, rej) => {
        db.get(COLLECTION)
            .update({_id: ObjectId(id)}, {"$set": data})
            .then(() => {
                res(data)
            })
            .catch((err) => rej(err));
    })
}

function deleteListing(db, id) {
    return new Promise((res, rej) => {
        db.get(COLLECTION)
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