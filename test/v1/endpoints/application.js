const assert = require("assert");
const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const ObjectId = require("mongodb").ObjectId;

const config = require('../../../config/db');
const db = require('monk')(config.mongoUrl);
const env = require("../../../config/collections").test;

const landlordCol = env.landlords;
const userCol = env.users;
const listingCol = env.listings;

const helper = require("./helper");
const landlordModel = require("../../../routes/v1/models/landlord");
const userModel = require("../../../routes/v1/models/user");
const listingModel = require("../../../routes/v1/models/listing");

const listingCreationUseCase = require("../../../routes/v1/use_cases/listing/listing_creation");
const listingRetrievalUseCase = require("../../../routes/v1/use_cases/listing/listing_retrieval");

const userCreationUseCase = require("../../../routes/v1/use_cases/user/user_account_creation");
const userRetrievalUseCase = require("../../../routes/v1/use_cases/user/user_account_retrieval");

const landlordCreationUseCase = require("../../../routes/v1/use_cases/landlord/landlord_account_creation");
const landlordRetrievalUseCase = require("../../../routes/v1/use_cases/landlord/landlord_account_retrieval");

function dropDb() {
    return db.get(listingCol).drop()
        .then(() => db.get(userCol).drop())
        .then(() => db.get(landlordCol).drop())
}

function seedDb() {
    return createLandlord()
        .then((landlord) => landlord["_id"])
        .then((uuid) => createListingObject(uuid))
        .then((listing) => listingCreationUseCase.createListing(db, listingCol, listing))
        .then(() => createUsers())
}

function getDobFromAge(age) {
    let now = new Date();
    return new Date(now.getFullYear() - age, now.getMonth(), now.getDay(), 0, 0, 0, 0).toDateString();
}

function createUsers() {
    const user1 = userModel.generate("Edmond", "Ó Floinn", getDobFromAge(20), "male", "professional");
    const user2 = userModel.generate("Student", "User", getDobFromAge(30), "female", "student");
    const user3 = userModel.generate("Non-Binary", "User", getDobFromAge(40), "other", "professional");

    return Promise.all([
        userCreationUseCase.createAccount(db, userCol, user1),
        userCreationUseCase.createAccount(db, userCol, user2),
        userCreationUseCase.createAccount(db, userCol, user3)
    ])
}

function createLandlord() {
    const landlord = landlordModel.generate("Emma", "Sheeran", "emma.sheeran@test.com", "0");
    return landlordCreationUseCase.createAccount(db, landlordCol, landlord)
}

function createListingObject(landlordUuid) {
    const today = new Date();
    let expiry = new Date();
    expiry.setDate(today.getDate() + 21);

    return Promise.resolve(
        listingModel.generate(
            "rent",
            landlordUuid,
            listingModel.generateAddress("22", "Goldsmith St.", "Phibsborough", "Dublin", "Dublin", "D07 FK2W"),
            listingModel.generateDetails("apartment", "Awesome apartment", "No caveats :)", 12, 20, 25, "male", "professional"),
            ["shared", "ensuite", "ensuite"],
            ["single", "double", "twin"],
            listingModel.generateFacilities(true, true, false, false, true, false),
            listingModel.generateListing("free", false, true, "B1")
        )
    );
}

describe("api application management", () => {
    beforeEach((done) => {
        dropDb()
            .then(() => seedDb())
            .then(() => {
                chai.use(chaiHttp);
                done()
            })
            .catch((err) => done(err))
    });

    afterEach((done) => {
        dropDb().then(() => done()).catch((err) => done(err));
    });

    it('should return 201 to a new user who makes an application for a fitting listing', (done) => {
        done()
    });

    it('should return 403 to a new user who makes an application for a non-fitting listing', (done) => {
        done()
    });

    it('should return 404 to a new user who makes an application for a non-existent listing', (done) => {
        done()
    });

    it('should return 500 to user who is a previous applicant who makes an application for a listing', (done) => {
        done()
    });

    it('should return 500 to new user who makes an application for a fitting non-applicable listing', (done) => {
        done()
    });
});