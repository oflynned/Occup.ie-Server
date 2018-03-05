let record = require("../common/record");
const ObjectId = require("mongodb").ObjectId;

function doesLandlordExist(db, collection, filter) {
    return new Promise((res, rej) => {
        record.getRecords(db, collection, filter)
            .then((records) => records.length > 0 ? res() : rej())
            .catch((err) => new Error("Landlord doesn't exist"))
    })
}

function isLandlordPhoneVerified(db, collection, id) {
    return new Promise((res, rej) => {
        record.getRecords(db, collection, {_id: ObjectId(id)})
            .then((landlord) => landlord[0]["phone_verified"] ? res() : rej("unverified_phone"))
    })
}

function isLandlordIdentityVerified(db, collection, id) {
    return new Promise((res, rej) => {
        record.getRecords(db, collection, {_id: ObjectId(id)})
            .then((landlord) => landlord[0]["identity_verified"] ? res() : rej("unverified_identity"))
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

function verifyLandlordPhone(db, collection, id) {
    return record.getRecords(db, collection, {_id: ObjectId(id)})
        .then((landlord) => {
            landlord = landlord[0];
            landlord["phone_verified"] = true;
            return record.modifyRecord(db, collection, landlord, id)
        })
        .then(() => id)
}

function verifyLandlordIdentity(db, collection, id) {
    return record.getRecords(db, collection, {_id: ObjectId(id)})
        .then((landlord) => {
            landlord = landlord[0];
            landlord["identity_verified"] = true;
            return record.modifyRecord(db, collection, landlord, id)
        })
        .then(() => id)
}

module.exports = {
    isLandlordIdentityVerified: isLandlordIdentityVerified,
    isLandlordPhoneVerified: isLandlordPhoneVerified,
    verifyLandlordIdentity: verifyLandlordIdentity,
    verifyLandlordPhone: verifyLandlordPhone,
    doesLandlordExist: doesLandlordExist,
    getLandlords: getLandlords,
    modifyLandlord: modifyLandlord,
    deleteLandlord: deleteLandlord
};