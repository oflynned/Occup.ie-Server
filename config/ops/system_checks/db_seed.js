const userModel = require("../../../models/user");
const houseShareModel = require("../../../models/house_share");
const rentalModel = require("../../../models/rental");
const landlordModel = require("../../../models/landlord");
const applicationModel = require("../../../models/application");

const userCreationUseCase = require("../../../models/use_cases/user/user_account_creation");
const userRetrievalUseCase = require("../../../models/use_cases/user/user_account_retrieval");

const houseShareCreationUseCase = require("../../../models/use_cases/listing/house_share_creation");
const houseShareRetrievalUseCase = require("../../../models/use_cases/listing/house_share_retrieval");

const rentalCreationUseCase = require("../../../models/use_cases/listing/rental_creation");
const rentalRetrievalUseCase = require("../../../models/use_cases/listing/rental_retrieval");

const landlordCreationUseCase = require("../../../models/use_cases/landlord/landlord_account_creation");
const landlordRetrievalUseCase = require("../../../models/use_cases/landlord/landlord_account_retrieval");

const applicationCreationUseCase = require("../../../models/use_cases/application/application_creation");
const applicationRetrievalUseCase = require("../../../models/use_cases/application/application_retrieval");

// TODO limit to dev environment

function getRandom(limit) {
    return Math.floor(Math.random() * limit);
}

function getSex() {
    const sexes = ["male", "female", "other"];
    return sexes[getRandom(sexes.length)];
}

function getProfession() {
    const professions = ["student", "professional"];
    return professions[getRandom(professions.length)];
}

function getTargetTenant() {
    const targets = ["individual", "couple"];
    return targets[getRandom(targets.length)];
}

function getDob() {
    const minAge = 18;
    let now = new Date();
    let birthYear = now.getFullYear() - getRandom(30) - minAge;
    return new Date(birthYear, now.getMonth(), now.getDay(), 0, 0, 0);
}

function getAgeLimits() {
    let minAge = getRandom(40) + 18;
    let maxAge = minAge + getRandom(40);
    return [minAge, maxAge]
}

function generateUuid(iterations) {
    let output = "";
    for (let i = 0; i < iterations; i++)
        output += getRandom(9) + 1;
    return output
}

function getRandomTruth() {
    return Math.random() >= 0.5
}

function generateLetter() {
    return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".substr(getRandom(26), 1);
}

function generateGibberish(length) {
    let output = "";
    for (let i = 0; i < length; i++)
        output += (i % 5 === 0 && i > 0) ? " " : generateLetter()
    return output.toLowerCase()
}

function getPhoneNumber() {
    const prefix = "+353";
    const providerCodes = ["83", "85", "87", "89"];
    let providerCode = providerCodes[getRandom(providerCodes.length)];

    return [prefix, providerCode, generateUuid(3), generateUuid(4)].join("");
}

function getEircode() {
    return generateLetter() + generateUuid(1) + generateUuid(1) +
        generateLetter() + generateUuid(1) + generateLetter() + generateUuid(1)
}

function getRandomBer() {
    const ber = ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3", "D1", "D2", "E1", "E2", "F", "G"];
    return ber[getRandom(ber.length)]
}

function getRandomPlan() {
    const plans = ["entry", "medium", "deluxe"];
    return plans[getRandom(plans.length)]
}

function getBathrooms(size) {
    let output = [];
    const types = ["shared", "ensuite"];
    for (let i = 0; i < size; i++) {
        output.push(types[getRandom(types.length)]);
    }

    return output;
}

function getBedrooms(amount, isHouseShare) {
    let output = [];
    const types = ["single", "double", "shared"];
    for (let i = 0; i < amount; i++) {
        let bedroom = {};
        let rent = getRandom(300) + 400;
        if (isHouseShare) {
            bedroom = {
                size: types[getRandom(types.length)],
                deposit: rent,
                rent: rent
            }
        } else {
            bedroom = types[getRandom(types.length)]
        }

        output.push(bedroom);
    }

    return output;
}

function seedUsers(db, col, size) {
    let jobs = [];
    for (let i = 0; i < size; i++) {
        let user = userModel.generate(`user_${i}_forename`, `user_${i}_surname`, getDob(), getSex(), getProfession());
        let result = userModel.validate(user);
        if (result["error"] !== null)
            throw new Error(result);

        jobs.push(userCreationUseCase.createAccount(db, col, user));
    }

    return Promise.all(jobs);
}

function seedLandlords(db, col, size) {
    let jobs = [];
    for (let i = 0; i < size; i++) {
        let landlord = landlordModel.generate(`landlord_${i}_forename`, `landlord_${i}_surname`, getDob(), getPhoneNumber());
        let result = landlordModel.validate(landlord);
        if (result["error"] !== null)
            throw new Error(result);

        jobs.push(landlordCreationUseCase.createAccount(db, col, landlord));
    }

    return Promise.all(jobs);
}

function seedHouseShares(env, db, size) {
    let landlords = [];
    let jobs = [];

    return landlordRetrievalUseCase.getLandlords(db, env.landlords)
        .then((_landlords) => landlords = _landlords)
        .then(() => {
            for (let i = 0; i < size; i++) {
                let uuid = landlords[getRandom(landlords.length)]["_id"];
                let ageLimits = getAgeLimits();
                let bathrooms = getBathrooms(getRandom(4) + 1);
                let bedrooms = getBedrooms(getRandom(6) + 1, true);
                let address = houseShareModel.generateAddress(getRandom(bedrooms.length), getRandom(100), generateGibberish(5), generateGibberish(10), `Dublin`, `Co. Dublin`, getEircode());
                let details = houseShareModel.generateDetails("apartment", generateGibberish(60), 12, ageLimits[0], ageLimits[1], [getSex()], [getProfession()]);
                let facilities = houseShareModel.generateFacilities(getRandomTruth(), getRandomTruth(), getRandomTruth(), getRandomTruth(), getRandomTruth(), getRandomTruth(), getRandomTruth());
                let listing = houseShareModel.generateListing(getRandomPlan(), getRandomTruth(), getRandomTruth(), getRandomBer());
                let job = houseShareModel.generate(uuid, address, details, bathrooms, bedrooms, facilities, listing);

                let result = houseShareModel.validate(job);
                console.log(result);
                if (result["error"] !== null)
                    throw new Error(result);

                jobs.push(houseShareCreationUseCase.createListing(db, env.listings, job));
            }
        })
        .then(() => Promise.all(jobs));
}

function seedRentals(env, db, size) {
    let landlords = [];
    let jobs = [];

    return landlordRetrievalUseCase.getLandlords(db, env.landlords)
        .then((_landlords) => landlords = _landlords)
        .then(() => {
            for (let i = 0; i < size; i++) {
                let uuid = landlords[getRandom(landlords.length)]["_id"];
                let bathrooms = getBathrooms(generateUuid(1));
                let bedrooms = getBedrooms(generateUuid(1));
                let address = rentalModel.generateAddress(undefined, generateUuid(2), generateGibberish(5), generateGibberish(10), `Dublin`, `Co. Dublin`, getEircode());
                let details = rentalModel.generateDetails("apartment", generateGibberish(60), 12, [getTargetTenant()]);
                let facilities = rentalModel.generateFacilities(getRandomTruth(), getRandomTruth(), getRandomTruth(), getRandomTruth(), getRandomTruth(), getRandomTruth(), getRandomTruth());

                let rent = (bedrooms.length * 500) + getRandom(600);
                let listing = rentalModel.generateListing(rent, rent, getRandomPlan(), getRandomTruth(), getRandomTruth(), getRandomBer());
                let job = rentalModel.generate(uuid, address, details, bathrooms, bedrooms, facilities, listing);

                let result = rentalModel.validate(job);
                if (result["error"] !== null)
                    throw new Error(result);

                jobs.push(rentalCreationUseCase.createListing(db, env.listings, job));
            }
        })
        .then(() => Promise.all(jobs));
}

function seedApplications(env, db, size) {
    let jobs = [];
    let users = [];
    let houseShares = [];
    let rentals = [];

    return userRetrievalUseCase.getUsers(db, env.users)
        .then((_users) => users = _users)
        .then(() => houseShareRetrievalUseCase.getListings(db, env.listings))
        .then((listings) => houseShares = listings)
        .then(() => rentalRetrievalUseCase.getListings(db, env.listings))
        .then((listings) => rentals = listings)
        .then(() => {
            for (let i = 0; i < size; i++) {
                let user = users[getRandom(users.length)];
                let listings = houseShares.concat(rentals);
                let listing = listings[getRandom(listings.length)];

                if (houseShareRetrievalUseCase.isListingFitting(user, listing)) {
                    let application = applicationModel.generate(user["_id"], listing["landlord_uuid"], listing["_id"]);
                    let result = applicationModel.validate(application);
                    if (result["error"] !== null)
                        throw new Error(result);

                    jobs.push(applicationCreationUseCase.createApplication(db, env.applications, application))
                }
            }
        })
        .then(() => Promise.all(jobs))
}

module.exports = {
    purge: function (env, db) {
        let count = 0;

        return Promise.all([
            userRetrievalUseCase.getUsers(db, env.users)
                .then((users) => count += users.length),
            landlordRetrievalUseCase.getLandlords(db, env.landlords)
                .then((landlords) => count += landlords.length),
            houseShareRetrievalUseCase.getListings(db, env.listings)
                .then((listings) => count += listings.length)
        ]).then(() => Promise.all([
            db.get(env.users).drop(),
            db.get(env.landlords).drop(),
            db.get(env.listings).drop(),
            db.get(env.applications).drop()
        ]).then(() => Promise.resolve(count)))
    },

    seed: function (env, db, seedType, seedSize) {
        switch (seedType) {
            case "landlord":
                return seedLandlords(db, env.landlords, seedSize);
            case "user":
                return seedUsers(db, env.users, seedSize);
            case "application":
                return seedApplications(env, db, seedSize);
            case "house-share":
                return seedHouseShares(env, db, seedSize);
            case "rental":
                return seedRentals(env, db, seedSize);
        }
    },

    seedAll: function (env, db, seedSize) {
        seedLandlords(db, env.landlords, seedSize)
            .then(() => seedRentals(env, db, seedSize * 5))
            .then(() => seedHouseShares(env, db, seedSize * 5))
            .then(() => seedUsers(db, env.users, seedSize * 10))
            .then(() => seedApplications(env, db, seedSize * 100))
    }
};