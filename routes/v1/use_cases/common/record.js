function createRecord(db, data, collection) {
    return new Promise((res, rej) => {
        db.get(collection)
            .insert(data)
            .then((record) => res(record))
            .catch((err) => rej(err))
    })
}

function getRecords(db, collection, filter = {}) {
    console.log(collection);
    return new Promise((res, rej) => {
        db.get(collection)
            .find(filter)
            .then((records) => res(records))
            .catch((err) => rej(err))
    })
}

function modifyRecord(db, collection, data, id) {
    return new Promise((res, rej) => {
        db.get(collection)
            .update({_id: ObjectId(id)}, {"$set": data})
            .then(() => {
                res(data)
            })
            .catch((err) => rej(err));
    })
}

function deleteRecord(db, collection, id) {
    return new Promise((res, rej) => {
        db.get(collection)
            .remove({_id: ObjectId(id)})
            .then((record) => res(record))
            .catch((err) => rej(err))
    })
}

module.exports = {
    createRecord: createRecord,
    getRecords: getRecords,
    modifyRecord: modifyRecord,
    deleteRecord: deleteRecord
};
