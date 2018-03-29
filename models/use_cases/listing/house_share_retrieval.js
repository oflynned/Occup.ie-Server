let record = require("../common/record");

function getDobFromAge(age) {
    let now = new Date();
    return new Date(now.getFullYear() - age, now.getMonth(), now.getDay());
}

function convert(d) {
    switch (d.constructor) {
        case Date:
            return d;
        case Array:
            return new Date(d[0], d[1], d[2]);
        case Number:
            return new Date(d);
        case String:
            return new Date(d);
        default:
            return typeof d === "object" ? new Date(d.year, d.month, d.date) : NaN
    }
}

function inRange(d, start, end) {
    return (
        isFinite(d = convert(d).valueOf()) &&
        isFinite(start = convert(start).valueOf()) &&
        isFinite(end = convert(end).valueOf()) ?
            start <= d && d <= end :
            NaN
    );
}

function isListingFitting(user, listing) {
    if (listing["type"] === "rental")
        return true;

    let minDob = getDobFromAge(listing["details"]["min_target_age"]);
    let maxDob = getDobFromAge(listing["details"]["max_target_age"]);

    let userDob = new Date(user["details"]["dob"]);
    let listingSex = listing["details"]["target_tenant"];
    let userSex = user["details"]["sex"];

    let listingProfession = listing["details"]["target_profession"];
    let userProfession = user["details"]["profession"];

    // 1993, 1995, 1998
    // max, user, min

    return inRange(userDob, maxDob, minDob) &&
        listingSex.includes(userSex) && listingProfession.includes(userProfession);
}

module.exports = {
    doesListingExist: function (db, collection, filter) {
        return new Promise((res, rej) => {
            record.getRecords(db, collection, filter)
                .then((records) => records.length > 0 ? res() : rej(new Error("non_existent_listing")))
                .catch((err) => rej(err))
        })
    },

    isListingFitting: isListingFitting,

    validateListingIsFitting: function (db, userCol, listingCol, application) {
        return new Promise((res, rej) => {
            let user = {};

            record.getRecords(db, userCol, application["user_id"])
                .then((_user) => {
                    if (_user.length === 0) rej(new Error("non_existent_user"));
                    user = _user[0]
                })
                .then(() => record.getRecords(db, listingCol, application["listing_id"]))
                .then((listings) => {
                    if (listings.length === 0) rej(new Error("non_existent_listing"));

                    let listing = listings[0];
                    switch (listing["type"]) {
                        case "rental":
                            res();
                            break;
                        case "house_share":
                            isListingFitting(user, listing) ? res() : rej(new Error("unfitting_candidate"));
                            break;
                        default:
                            rej(new Error("unknown_listing_type"));
                            break;
                    }
                })
        })
    },

    validateListingIsOpen: function (db, collection, filter) {
        return new Promise((res, rej) => {
            record.getRecords(db, collection, filter)
                .then((records) => records[0]["listing"]["status"] === "open" ? res() : rej("non_applicable_listing"))
        });
    },

    getListings: function (db, collection, filter = {}, suppressedFields = {}) {
        return record.getRecords(db, collection, filter, suppressedFields)
    },

    modifyListing: function (db, collection, data, id) {
        return record.modifyRecord(db, collection, data, id)
    },

    deleteListing: function (db, collection, id) {
        return record.deleteRecord(db, collection, id)
    }
};