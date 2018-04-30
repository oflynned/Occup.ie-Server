let filter = require("../../filter");
let record = require("../common/record");

function transformQuery(params) {
    let filter = {query: {}, order: {}};

    for (let param in params) {
        switch (param) {
            case "dwelling":
            case "county":
            case "sex":
                filter["query"][param] = JSON.parse(params[param]);
                break;
            case "landlord_id":
            case "min_lease_length":
            case "max_lease_length":
            case "min_bedrooms":
            case "max_bedrooms":
            case "min_bathrooms":
            case "max_bathrooms":
            case "min_rent":
            case "max_rent":
            case "min_age":
            case "max_age":
                filter["query"][param] = params[param];
                break;
            case "time_renewed":
            case "rent":
                filter["order"][param] = params[param];
                break;
            default:
                break;
        }
    }

    return Promise.resolve(filter);
}

function getQueryString(filter) {
    let query = {"$and": []};
    for (let param in filter["query"]) {
        switch (param) {
            case "min_rent":
                query["$and"].push({"listing.rent": {"$gte": Number(filter["query"]["min_rent"])}});
                break;
            case "max_rent":
                query["$and"].push({"listing.rent": {"$lte": Number(filter["query"]["max_rent"])}});
                break;
        }
    }

    console.log(query);

    return query;
}

function validateFiltersApplied(queryObject) {
    return filter.validateQuery(queryObject);
}

function filterListings(db, collection, filter = {}) {
    return record.getRecords(db, collection, filter)
}

module.exports = {
    validateFilters: validateFiltersApplied,
    filterListings: filterListings,
    getQueryString: getQueryString,
    transformQuery: transformQuery
};