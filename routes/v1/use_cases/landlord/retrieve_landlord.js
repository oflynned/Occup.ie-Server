let ObjectId = require('mongodb').ObjectID;
const collection = require("../../common/collections").landlords;

function getLandlords(db, filter={}) {
    return new Promise((res, rej) => {
        db.get(collection)
            .find(filter)
            .then((records) => res(records))
            .catch((err) => rej(err))
    })
}

function modifyLandlord(db, id, data) {
    return new Promise((res, rej) => {
        db.get(collection)
            .update({_id: ObjectId(id)}, {"$set": data})
            .then(() => {
                res(data)
            })
            .catch((err) => rej(err));
    })
}

function deleteLandlord(db, id) {
    return new Promise((res, rej) => {
        db.get(collection)
            .remove({_id: ObjectId(id)})
            .then((record) => res(record))
            .catch((err) => rej(err))
    })
}

function getLandlordParams(user, updatedLandlord) {
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

module.exports = {
    getLandlords: getLandlords,
    modifyLandlord: modifyLandlord,
    deleteLandlord: deleteLandlord
};