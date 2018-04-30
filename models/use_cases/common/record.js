module.exports = {
    createRecord: function (db, collection, data) {
        return new Promise((res, rej) => {
            db.get(collection)
                .insert(data)
                .then((record) => res(record))
                .catch((err) => rej(err))
        })
    },

    getRecords: function (db, collection, filter = {}, suppressedFields = {}, sorting = {}, limit = -1, offset = -1) {
        return new Promise((res, rej) => {
            db.get(collection)
                .find(filter, suppressedFields)
                .then((records) => res(records))
                .catch((err) => rej(err))
        })
    },

    modifyRecord: function (db, collection, data, id) {
        return new Promise((res, rej) => {
            db.get(collection)
                .update({_id: id}, {"$set": data})
                .then(() => res(data))
                .catch((err) => rej(err));
        })
    },

    deleteRecord: function (db, collection, id) {
        return new Promise((res, rej) => {
            db.get(collection)
                .remove({_id: id})
                .then((record) => res(record))
                .catch((err) => rej(err))
        })
    }
};
