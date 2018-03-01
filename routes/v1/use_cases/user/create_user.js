const collection = require("../../common/collections").users;
let user = require("../../models/user");
let record = require("../common/create_record");

function validatePayload(data) {
    return new Promise((res, rej) => {
        let results = user.validate(data);
        results["error"] === null ? res() : rej(results["error"]);
    })
}

function validateUserIsUnique(db, data) {
    return new Promise((res, rej) => {
        db.get(collection)
            .find({facebook_id: data["facebook_id"]})
            .then((users) => {
                if (users.length === 0)
                    res();
                else
                    throw new Error("User is not unique");
            })
            .catch((err) => rej(err))
    })
}

function generateUser() {
    return user.generate("Emma", "Sheeran", 22, "female")
}

function generateUserObject(payload) {
    return new Promise((res, rej) => {
        res({
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
        })
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

function createAccount(db, data) {
    return record.createRecord(db, data, collection)
}

module.exports = {
    validatePayload: validatePayload,
    validateUserIsUnique: validateUserIsUnique,
    generateUser: generateUser,
    generateUserObject: generateUserObject,
    getUserParams: getUserParams,
    createAccount: createAccount
};