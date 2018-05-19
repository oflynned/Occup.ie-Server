let landlord = require("../../landlord");
let record = require("../common/record");
let utf8 = require("utf8");

function getUserAge(birthday) {
    let date = new Date(birthday);
    let ageDiffMillis = Date.now() - date.getTime();
    let ageDate = new Date(ageDiffMillis);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

module.exports = {
    validateLandlordAge: function (data) {
        return new Promise((res, rej) => {
            getUserAge(data["details"]["dob"]) >= 18 ? res() : rej(new Error("underage_landlord"));
        });
    },

    validatePayload: function (data) {
        return new Promise((res, rej) => {
            let results = landlord.validate(data);
            results["error"] === null ? res() : rej(new Error("bad_request"));
        })
    },

    validateLandlordIsUnique: function (db, collection, data) {
        return new Promise((res, rej) => {
            db.get(collection)
                .find({"oauth.oauth_id": data["oauth"]["oauth_id"]})
                .then((users) => res(users.length === 0))
                .catch((err) => rej(err))
        })
    },

    createAccount: function (db, collection, data) {
        data["details"]["forename"] = utf8.encode(data["details"]["forename"]);
        data["details"]["surname"] = utf8.encode(data["details"]["surname"]);

        if (!["male", "female"].includes(data["details"]["sex"]))
            data["details"]["sex"] = "other";
        return record.createRecord(db, collection, data)
    }
};