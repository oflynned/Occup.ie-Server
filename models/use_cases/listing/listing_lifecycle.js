let record = require("../common/record");

// pending, active, paused, expired, invalid

function markExpired(db, collection, listing) {

}

function checkState(db, collection, listing) {
    console.log(listing);
}

function manageListings(db, collection) {
    let jobs = [];
    return record.getRecords(db, collection, {
        "$and": [
            {"listing.expires": {"$lt": new Date()}},
            {"details.state": "active"}
        ]
    })
        .then((listings) => listings.forEach((listing) => jobs.push(checkState(db, collection, listing))))
        .then(() => Promise.all(jobs))
}

module.exports = (db, collection) => {
    let lifecycle = {};
    lifecycle.manageListings = manageListings(db, collection);
    return lifecycle;
};