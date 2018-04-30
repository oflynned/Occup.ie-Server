let filter = require("../../filter");
let record = require("../common/record");
let ObjectId = require("mongodb").ObjectId;

function transformQuery(params, listingType) {
    let filter = {query: {listing_type: listingType}, order: {}};

    for (let param in params) {
        switch (param) {
            case "dwelling":
            case "county":
            case "profession":
            case "sex":
                filter["query"][param] = JSON.parse(params[param]);
                break;
            case "status":
            case "limit":
            case "offset":
            case "landlord_uuid":
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
            case "cost":
                filter["order"][param] = params[param];
                break;
        }
    }

    return Promise.resolve(filter);
}

function getQueryString(filter) {
    let query = {"$and": []};
    for (let param in filter["query"]) {
        switch (param) {
            case "status":
                query["$and"].push({"listing.status": filter["query"]["status"]});
                break;
            case "limit":
                break;
            case "offset":
                break;

            case "county":
                query["$and"].push({"address.county": {"$in": filter["query"]["county"]}});
                break;
            case "dwelling":
                query["$and"].push({"details.dwelling": {"$in": filter["query"]["dwelling"]}});
                break;
            case "landlord_id":
                query["$and"].push({"landlord_uuid": ObjectId(filter["query"]["landlord_uuid"])});
                break;
            case "min_lease_length":
                query["$and"].push({"details.lease_length_months": {"$gte": Number(filter["query"]["min_lease_length"])}});
                break;
            case "max_lease_length":
                query["$and"].push({"details.lease_length_months": {"$lte": Number(filter["query"]["max_lease_length"])}});
                break;
            case "min_bathrooms":
                query["$and"].push({"bathrooms": {"$size": {"$gte": Number(filter["query"]["min_bathrooms"])}}});
                break;
            case "max_bathrooms":
                query["$and"].push({"bathrooms": {"$size": {"$lte": Number(filter["query"]["max_bathrooms"])}}});
                break;
            case "min_bedrooms":
                query["$and"].push({"bedrooms": {"$size": {"$gte": Number(filter["query"]["min_bedrooms"])}}});
                break;
            case "max_bedrooms":
                query["$and"].push({"bedrooms": {"$size": {"$lte": Number(filter["query"]["max_bedrooms"])}}});
                break;
            case "min_rent":
                query["$and"].push({"listing.rent": {"$gte": Number(filter["query"]["min_rent"])}});
                break;
            case "max_rent":
                query["$and"].push({"listing.rent": {"$lte": Number(filter["query"]["max_rent"])}});
                break;

            case "sex":
                query["$and"].push({"details.target_tenant": {"$in": filter["query"]["sex"]}});
                break;
            case "profession":
                query["$and"].push({"details.target_profession": {"$in": filter["query"]["profession"]}});
                break;
            case "min_age":
                query["$and"].push({"details.min_target_age": {"$gte": Number(filter["query"]["min_age"])}});
                break;
            case "max_age":
                query["$and"].push({"details.max_target_age": {"$lte": Number(filter["query"]["max_age"])}});
                break;

            case "time_renewed":
                break;
            case "price":
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