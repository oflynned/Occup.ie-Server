const userModel = require("../../../../routes/v1/models/user");
const listingModel = require("../../../../routes/v1/models/listing");
const landlordModel = require("../../../../routes/v1/models/landlord");

const userCreationUseCase = require("../../../../routes/v1/use_cases/user/user_account_creation");
const userRetrievalUseCase = require("../../../../routes/v1/use_cases/user/user_account_retrieval");

const listingCreationUseCase = require("../../../../routes/v1/use_cases/listing/listing_creation");
const listingRetrievalUseCase = require("../../../../routes/v1/use_cases/listing/listing_retrieval");

const landlordCreationUseCase = require("../../../../routes/v1/use_cases/landlord/landlord_account_creation");
const landlordRetrievalUseCase = require("../../../../routes/v1/use_cases/landlord/landlord_account_retrieval");

function getSex() {
    const sexes = ["male", "female", "other"];
    return sexes[Math.floor(Math.random() * sexes.length)];
}

function getProfession() {
    const professions = ["student", "professional"];
    return professions[Math.floor(Math.random() * professions.length)];
}

function getDob() {
    const minAge = 18;
    let now = new Date();
    let birthYear = now.getFullYear() - Math.floor(Math.random() * 30) - minAge;
    return new Date(birthYear, now.getMonth(), now.getDay(), 0, 0, 0);
}

function generateUuid(iterations) {
    let output = "";
    let i = 0;
    while (i < iterations) {
        output += Math.floor(Math.random() * 9);
        i++;
    }

    return output
}

function getPhoneNumber() {
    const prefix = "+353";
    const providerCodes = ["83", "85", "87", "89"];
    let providerCode = providerCodes[Math.floor(Math.random() * providerCodes.length)];

    return [prefix, providerCode, generateUuid(3), generateUuid(4)].join(" ");
}

function seedUsers(db, col, size) {
    let jobs = [];
    let i = 0;

    while (i < size) {
        let user = userModel.generate(`user_${i}_forename`, `user_${i}_surname`, getDob(), getSex(), getProfession());
        jobs.push(userCreationUseCase.createAccount(db, col, user));
        i++;
    }

    return Promise.all(jobs);
}

function seedLandlords(db, col, size) {
    let jobs = [];
    let i = 0;

    while (i < size) {
        let landlord = landlordModel.generate(`landlord_${i}_forename`, `landlord_${i}_surname`, getDob(), getPhoneNumber());
        jobs.push(landlordCreationUseCase.createAccount(db, col, landlord));
        i++;
    }

    return Promise.all(jobs);
}

function seedListings(env, db, size) {
    /*
    return userRetrievalUseCase.getUsers(db, env.users)
        .then((count) => {
            if (count < size) throw new Error("insufficient_users")
        })
        .then(() => landlordRetrievalUseCase.getLandlords(db, env.landlords))
        .then((count) => {
            if (count < size) throw new Error("insufficient_landlords")
        })
        .then(() => {

        })*/

    let jobs = [];
    let i = 0;
    let landlords = [];
    let users = [];

    return landlordRetrievalUseCase.getLandlords(db, env.landlords)
        .then((_landlords) => landlords = _landlords)
        .then(() => {
            while (i < size) {
                let landlordUuid = landlords[Math.floor(Math.random() * landlords.length)]["_id"];
                jobs.push(listingCreationUseCase.generate)
                i++;
            }
        })
        .then(() => Promise.all(jobs));
}

module.exports = {
    purge: function (env, db) {
        let count = 0;

        return Promise.all([
            userRetrievalUseCase.getUsers(db, env.users)
                .then((users) => count += users.length),
            landlordRetrievalUseCase.getLandlords(db, env.landlords)
                .then((landlords) => count += landlords.length),
            listingRetrievalUseCase.getListings(db, env.listings)
                .then((listings) => count += listings.length)
        ]).then(() => Promise.all([
            db.get(env.users).drop(),
            db.get(env.landlords).drop(),
            db.get(env.listings).drop()
        ]).then(() => count))
    },

    seed: function (env, db, seedType, seedSize) {
        switch (seedType) {
            case "landlord":
                return seedLandlords(db, env.landlords, seedSize);
            case "user":
                return seedUsers(db, env.users, seedSize);
            case "listing":
                return seedListings(env, db, seedSize);
        }
    },

    seedAll: function (env, db, seedSize) {

    }
};