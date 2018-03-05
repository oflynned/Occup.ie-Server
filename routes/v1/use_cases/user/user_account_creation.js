let user = require("../../models/user");
let record = require("../common/record");

function validatePayload(data) {
    return new Promise((res, rej) => {
        let results = user.validate(data);
        results["error"] === null ? res() : rej(new Error("bad_request"));
    })
}

function getUserAge(birthday) {
    let date = birthday.split("-");
    let ageDiffMillis = Date.now() - new Date(date[0], date[1], date[2]).getTime();
    let ageDate = new Date(ageDiffMillis);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

function validateUserAge(data) {
    return new Promise((res, rej) => {
        getUserAge(data["dob"]) >= 18 ? res() : rej(new Error("underage_user"));
    });
}

function validateUserIsUnique(db, collection, data) {
    return new Promise((res, rej) => {
        db.get(collection)
            .find({facebook_id: data["facebook_id"]})
            .then((users) => {
                if (users.length === 0)
                    res();
                else
                    throw new Error("user_not_unique");
            })
            .catch((err) => rej(err))
    })
}

function generateUserObject(payload) {
    return Promise.resolve({
        email: payload["email"],
        forename: payload["forename"],
        surname: payload["surname"],
        facebook_id: payload["facebook_id"],
        facebook_token: payload["facebook_token"],
        identity_verified: false,
        profile_picture: payload["profile_picture"],
        age: payload["age"],
        sex: payload["sex"],
        profession: payload["profession"]
    });
}

function getUserParams(user, updatedUser) {
    user["email"] = updatedUser["email"] === undefined ? user["email"] : updatedUser["email"];
    user["forename"] = updatedUser["forename"] === undefined ? user["forename"] : updatedUser["forename"];
    user["surname"] = updatedUser["surname"] === undefined ? user["surname"] : updatedUser["surname"];
    user["facebook_id"] = updatedUser["facebook_id"] === undefined ? user["facebook_id"] : updatedUser["facebook_id"];
    user["facebook_token"] = updatedUser["facebook_token"] === undefined ? user["facebook_token"] : updatedUser["facebook_token"];
    user["profile_picture"] = updatedUser["profile_picture"] === undefined ? user["profile_picture"] : updatedUser["profile_picture"];
    user["age"] = updatedUser["age"] === undefined ? user["age"] : updatedUser["age"];
    user["sex"] = updatedUser["sex"] === undefined ? user["sex"] : updatedUser["sex"];
    user["profession"] = updatedUser["profession"] === undefined ? user["profession"] : updatedUser["profession"];

    validatePayload(user);
    return user;
}

function createAccount(db, collection, data) {
    return record.createRecord(db, collection, data)
}

module.exports = {
    validateUserAge: validateUserAge,
    validatePayload: validatePayload,
    validateUserIsUnique: validateUserIsUnique,
    generateUserObject: generateUserObject,
    getUserParams: getUserParams,
    createAccount: createAccount
};