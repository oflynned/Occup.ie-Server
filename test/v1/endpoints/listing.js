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
    return Promise.all([createLandlords()])
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

function createLandlords() {
    const landlord = landlordModel.generate("Emma", "Sheeran", "emma.sheeran@test.com", "0");
    return landlordCreationUseCase.createAccount(db, landlordCol, landlord)
}

function createListing(landlordUuid) {
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

describe("api listing management", () => {
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

    it('should return 201 on creating a listing if the landlord is verified', (done) => {
        landlordRetrievalUseCase.getLandlords(db, landlordCol, {forename: "Emma"})
            .then((landlords) => landlords[0]["_id"])
            .then((uuid) => landlordRetrievalUseCase.verifyLandlordPhone(db, landlordCol, uuid))
            .then((uuid) => landlordRetrievalUseCase.verifyLandlordIdentity(db, landlordCol, uuid))
            .then((uuid) => createListing(uuid))
            .then((listing) => helper.postResource(`/api/v1/listing`, listing))
            .then((res) => assert.equal(res.status, 201))
            .then(() => listingRetrievalUseCase.getListings(db, listingCol))
            .then((listings) => {
                assert.equal(listings.length, 1);
                done()
            })
            .catch((err) => done(err))
    });

    it('should return 403 on creating a listing if the landlord is not phone verified', (done) => {
        landlordRetrievalUseCase.getLandlords(db, landlordCol, {forename: "Emma"})
            .then((landlords) => landlords[0]["_id"])
            .then((uuid) => landlordRetrievalUseCase.verifyLandlordIdentity(db, landlordCol, uuid))
            .then((uuid) => createListing(uuid))
            .then((listing) => helper.postResource(`/api/v1/listing`, listing))
            .then(() => done(new Error("Incorrectly accepted landlord without verified phone number")))
            .catch((err) => {
                assert.equal(err.response.status, 403);
                done()
            })
    });

    it('should return 403 on creating a listing if the landlord is not id verified', (done) => {
        landlordRetrievalUseCase.getLandlords(db, landlordCol, {forename: "Emma"})
            .then((landlords) => landlords[0]["_id"])
            .then((uuid) => landlordRetrievalUseCase.verifyLandlordPhone(db, landlordCol, uuid))
            .then((uuid) => createListing(uuid))
            .then((listing) => helper.postResource(`/api/v1/listing`, listing))
            .then(() => done(new Error("Incorrectly accepted landlord without verified phone number")))
            .catch((err) => {
                assert.equal(err.response.status, 403);
                done()
            })
    });
})
;