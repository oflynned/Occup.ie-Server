function sortByState(listings) {
    let activeListings = [];
    let pausedListings = [];
    let expiredListings = [];

    listings.forEach((listing) => {
        switch (listing["listing"]["status"]) {
            case "active":
                activeListings.push(listing);
                break;
            case "paused":
                pausedListings.push(listing);
                break;
            case "expired":
                expiredListings.push(listing);
                break;
        }
    });

    return {
        active: activeListings.sort((a, b) => sortByExpiration(a, b)),
        paused: pausedListings.sort((a, b) => sortByExpiration(a, b)),
        expired: expiredListings.sort((a, b) => sortByExpiration(a, b))
    };
}

function sortByExpiration(a, b) {
    return a["listing"]["expires"] > b["listing"]["expires"];
}

function sortListings(listings) {
    return sortByState(listings);
}

module.exports = {
    sortListings: sortListings
};