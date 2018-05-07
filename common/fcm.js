const FCM = require("fcm-push");
const FCM_KEY = process.env.FCM_API_KEY;

let userUseCase = require("../models/use_cases/user/user_account_retrieval");
let landlordUseCase = require("../models/use_cases/landlord/landlord_account_retrieval");
let featureFlagUseCase = require("../models/use_cases/feature_flags/retrieve_feature_flags");
let fcm = new FCM(FCM_KEY);

function getEventData(userToken, flagData) {
    return {to: userToken, data: flagData}
}

function getNotificationData(userToken, data, notification) {
    return {
        to: userToken,
        data: data,
        notification: notification
    }
}

function notifyAll(db, col) {
    let flags = [];
    let users = [];
    let landlords = [];

    Promise.all([
        featureFlagUseCase.loadAllJson().then((_flags) => flags = _flags),
        userUseCase.getUsers(db, col["user"]).then((_users) => users = _users),
        landlordUseCase.getLandlords(db, col["landlord"]).then((_landlords) => landlords = _landlords),
    ])
        .then(() => users.forEach((user) => fcm.send(getEventData(user["fcm_token"], flags))))
        .then(() => landlords.forEach((landlord) => fcm.send(getEventData(landlord["fcm_token"], flags))));
}

module.exports = {
    notifyAll: notifyAll
};
