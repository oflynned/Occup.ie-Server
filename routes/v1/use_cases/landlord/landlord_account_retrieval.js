let record = require("../common/record");

function getLandlords(db, collection, filter = {}) {
    console.log(collection);
    return record.getRecords(db, collection, filter)
}

function modifyLandlord(db, collection, data, id) {
    return record.modifyRecord(db, collection, data, id)
}

function deleteLandlord(db, collection, id) {
    return record.deleteRecord(db, collection, id)
}

module.exports = {
    getLandlords: getLandlords,
    modifyLandlord: modifyLandlord,
    deleteLandlord: deleteLandlord
};