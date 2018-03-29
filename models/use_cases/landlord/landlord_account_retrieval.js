let record = require("../common/record");
const ObjectId = require("mongodb").ObjectId;

module.exports = {
    doesLandlordExist: function (db, collection, filter) {
        return new Promise((res, rej) => {
            record.getRecords(db, collection, filter)
                .then((records) => records.length > 0 ? res() : rej(new Error("non_existent_landlord")))
        })
    },

    isLandlordPhoneVerified: function (db, collection, id) {
        return new Promise((res, rej) => {
            record.getRecords(db, collection, {_id: ObjectId(id)})
                .then((landlord) => landlord[0]["meta"]["phone_verified"] ? res() : rej(new Error("unverified_phone")))
        })
    },

    isLandlordIdentityVerified: function (db, collection, id) {
        return new Promise((res, rej) => {
            record.getRecords(db, collection, {_id: ObjectId(id)})
                .then((landlord) => landlord[0]["meta"]["identity_verified"] ? res() : rej(new Error("unverified_identity")))
        })
    },

    getLandlords: function (db, collection, filter = {}) {
        return record.getRecords(db, collection, filter)
    },

    modifyLandlord: function (db, collection, data, id) {
        return record.modifyRecord(db, collection, data, id)
    },

    deleteLandlord: function (db, collection, id) {
        return record.deleteRecord(db, collection, id)
    },

    verifyLandlordPhone: function (db, collection, id) {
        return record.getRecords(db, collection, {_id: ObjectId(id)})
            .then((landlord) => {
                landlord = landlord[0];
                landlord["meta"]["phone_verified"] = true;
                return record.modifyRecord(db, collection, landlord, id)
            })
            .then(() => id)
    },

    verifyLandlordIdentity: function (db, collection, id) {
        return record.getRecords(db, collection, {_id: ObjectId(id)})
            .then((landlord) => {
                landlord = landlord[0];
                landlord["meta"]["identity_verified"] = true;
                return record.modifyRecord(db, collection, landlord, id)
            })
            .then(() => id)
    },

    doesLandlordOwnListing: function (db, headers, landlordCol, listingsCol, uuid) {
        return new Promise((res, rej) => {
            record.getRecords(db, listingsCol, {_id: ObjectId(uuid)})
                .then((listings) => record.getRecords(db, landlordCol, {_id: ObjectId(listings[0]["landlord_uuid"])}))
                .then((landlords) => {
                    if (headers["oauth_id"] !== landlords[0]["oauth"]["oauth_id"])
                        rej(new Error("wrong_landlord_account"));

                    res();
                })
        })
    }
};