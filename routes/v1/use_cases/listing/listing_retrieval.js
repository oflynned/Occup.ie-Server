let record = require("../common/record");

function getDobFromAge(age) {
    let now = new Date();
    return new Date((now.getFullYear() - age) + "-" + (now.getMonth()) + "-" + now.getDay()).toDateString();
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

module.exports = {
    doesListingExist: function (db, collection, filter) {
        return new Promise((res, rej) => {
            record.getRecords(db, collection, filter)
                .then((records) => records.length > 0 ? res() : rej(new Error("non_existent_listing")))
                .catch((err) => rej(err))
        })
    },

    validateListingIsFitting: function (db, userCol, listingCol, application) {
        return new Promise((res, rej) => {
            let user = {};

            record.getRecords(db, userCol, application["user_id"])
                .then((_user) => {
                    if (_user.length === 0) rej(new Error("non_existent_user"));
                    user = _user
                })
                .then(() => record.getRecords(db, listingCol, application["listing_id"]))
                .then((listing) => {
                    if (listing.length === 0) rej(new Error("non_existent_listing"));

                    let minDob = getDobFromAge(listing[0]["details"]["min_target_age"]);
                    let maxDob = getDobFromAge(listing[0]["details"]["max_target_age"]);

                    let userDob = new Date(user[0]["dob"]).toDateString();
                    let listingSex = listing[0]["details"]["target_sex"];
                    let userSex = user[0]["sex"];

                    let listingProfession = listing[0]["details"]["target_profession"];
                    let userProfession = user[0]["profession"];

                    // 1993, 1995, 1998
                    // max, user, min

                    let isSuitable =
                        inRange(userDob, maxDob, minDob) &&
                        listingSex.includes(userSex) && listingProfession.includes(userProfession);

                    isSuitable ? res() : rej(new Error(("unfitting_candidate")))
                })
        })
    },

    validateListingIsOpen: function () {
        // TODO
    },

    getListings: function (db, collection, filter = {}) {
        return record.getRecords(db, collection, filter)
    },

    modifyListing: function (db, collection, data, id) {
        return record.modifyRecord(db, collection, data, id)
    },

    deleteListing: function (db, collection, id) {
        return record.deleteRecord(db, collection, id)
    }
};