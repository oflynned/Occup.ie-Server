function createRecord(db, data, collection) {
    return new Promise((res, rej) => {
        db.get(collection)
            .insert(data)
            .then((record) => res(record))
            .catch((err) => rej(err))
    })
}

module.exports = {
    createRecord: createRecord
};
