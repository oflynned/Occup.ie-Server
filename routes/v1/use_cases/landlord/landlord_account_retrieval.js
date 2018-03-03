let record = require("../common/record");

function doesLandlordExist(db, collection, filter) {
    return new Promise((res, rej) => {
        record.getRecords(db, collection, filter)
            .then((records) => records.length > 0 ? res() : rej())
            .catch((err) => new Error("Landlord doesn't exist"))
    })
}

function getLandlords(db, collection, filter = {}) {
    return record.getRecords(db, collection, filter)
}

function modifyLandlord(db, collection, data, id) {
    return record.modifyRecord(db, collection, data, id)
}

function deleteLandlord(db, collection, id) {
    return record.deleteRecord(db, collection, id)
}

module.exports = {
    doesLandlordExist: doesLandlordExist,
    getLandlords: getLandlords,
    modifyLandlord: modifyLandlord,
    deleteLandlord: deleteLandlord
};