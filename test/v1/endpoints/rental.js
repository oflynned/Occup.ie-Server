const assert = require("assert");
const chai = require("chai");
const chaiHttp = require("chai-http");
const ObjectId = require("mongodb").ObjectId;

const config = require('../../../config/db');
const db = require('monk')(config.mongoUrl);
const env = require("../../../config/collections").test;

const landlordCol = env.landlords;
const listingCol = env.listings;

const requestHelper = require("./request_helper");
const landlordModel = require("../../../routes/v1/models/landlord");
const listingModel = require("../../../routes/v1/models/rental");

const listingCreationUseCase = require("../../../routes/v1/use_cases/listing/house_share_creation");
const listingRetrievalUseCase = require("../../../routes/v1/use_cases/listing/house_share_retrieval");

const landlordCreationUseCase = require("../../../routes/v1/use_cases/landlord/landlord_account_creation");
const landlordRetrievalUseCase = require("../../../routes/v1/use_cases/landlord/landlord_account_retrieval");

function seedDb() {
    return createLandlord()
        .then((landlord) => landlord["_id"])
        .then((uuid) => createListingObject(uuid))
        .then((listing) => listingCreationUseCase.createListing(db, listingCol, listing))
}

function dropDb() {
    return Promise.all([db.get(listingCol).drop(), db.get(landlordCol).drop()])
}

function createLandlord() {
    const landlord = landlordModel.generate("Emma", "Sheeran", "emma.sheeran@test.com", "0");
    return landlordCreationUseCase.createAccount(db, landlordCol, landlord)
}

function createListingObject(landlordUuid) {
    return Promise.resolve(
        listingModel.generate(
            landlordUuid,
            listingModel.generateAddress("22", "Goldsmith St.", "Phibsborough", "Dublin", "Dublin", "D07 FK2W"),
            listingModel.generateDetails("apartment", "Awesome apartment", 12, ["individual"]),
            ["shared", "ensuite", "ensuite"],
            ["single", "double", "shared"],
            listingModel.generateFacilities(false, true, true, false, false, true, false),
            listingModel.generateListing(1000, "entry", false, true, "B1")
        )
    );
}

describe("api rental management", () => {
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
        dropDb()
            .then(() => createLandlord())
            .then(() => landlordRetrievalUseCase.getLandlords(db, landlordCol, {forename: "Emma"}))
            .then((landlords) => landlords[0]["_id"])
            .then((uuid) => landlordRetrievalUseCase.verifyLandlordPhone(db, landlordCol, uuid))
            .then((uuid) => landlordRetrievalUseCase.verifyLandlordIdentity(db, landlordCol, uuid))
            .then((uuid) => createListingObject(uuid))
            .then((listing) => requestHelper.postResource(`/api/v1/rental`, listing))
            .then((res) => assert.equal(res.status, 201))
            .then(() => listingRetrievalUseCase.getListings(db, listingCol))
            .then((listings) => {
                assert.equal(listings.length, 1);
                assert.equal(listings[0]["listing"]["status"], "open");
                assert.equal(listings[0]["listing"]["plan"], "entry");
                done()
            })
            .catch((err) => done(err))
    });

    it('should return 400 on creating a listing if there are missing parameters', (done) => {
        landlordRetrievalUseCase.getLandlords(db, landlordCol, {forename: "Emma"})
            .then((landlords) => landlords[0]["_id"])
            .then((uuid) => landlordRetrievalUseCase.verifyLandlordIdentity(db, landlordCol, uuid))
            .then((uuid) => {
                let listing = createListingObject(uuid);
                delete listing["address"];
            })
            .then((listing) => requestHelper.postResource(`/api/v1/rental`, listing))
            .then(() => done(new Error("Incorrectly accepted landlord listing creation with missing parameters")))
            .catch((err) => {
                assert.equal(err.response.status, 400);
                done()
            })
    });

    it('should return 403 on creating a listing if the landlord is not phone verified', (done) => {
        landlordRetrievalUseCase.getLandlords(db, landlordCol, {forename: "Emma"})
            .then((landlords) => landlords[0]["_id"])
            .then((uuid) => landlordRetrievalUseCase.verifyLandlordIdentity(db, landlordCol, uuid))
            .then((uuid) => createListingObject(uuid))
            .then((listing) => requestHelper.postResource(`/api/v1/rental`, listing))
            .then(() => done(new Error("Incorrectly accepted landlord listing creation without verified phone number")))
            .catch((err) => {
                assert.equal(err.response.status, 403);
                done()
            })
    });

    it('should return 403 on creating a listing if the landlord is not government id verified', (done) => {
        landlordRetrievalUseCase.getLandlords(db, landlordCol, {forename: "Emma"})
            .then((landlords) => landlords[0]["_id"])
            .then((uuid) => landlordRetrievalUseCase.verifyLandlordPhone(db, landlordCol, uuid))
            .then((uuid) => createListingObject(uuid))
            .then((listing) => requestHelper.postResource(`/api/v1/rental`, listing))
            .then(() => done(new Error("Incorrectly accepted landlord list creation without verified government id")))
            .catch((err) => {
                assert.equal(err.response.status, 403);
                done()
            })
    });

    it('should return 403 on creating a listing if the landlord uuid does not exist', (done) => {
        const nonExistentUuid = ObjectId();
        Promise.resolve(createListingObject(nonExistentUuid))
            .then((listing) => requestHelper.postResource(`/api/v1/rental`, listing))
            .then(() => done(new Error("Incorrectly accepted new listing given non-existent landlord uuid")))
            .catch((err) => {
                assert.equal(err.response.status, 403);
                done()
            })
    });

    it('should return 200 on a get request given the listing id of a property that exists', (done) => {
        listingRetrievalUseCase.getListings(db, listingCol)
            .then((listings) => listings[0]["_id"])
            .then((uuid) => requestHelper.getResource(`/api/v1/rental/${uuid}`))
            .then((res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.length, 1);
                done()
            })
            .catch((err) => done(err))
    });

    it('should return 404 on a get request given the listing id of a property that does not exist', (done) => {
        const nonExistentUuid = ObjectId();
        requestHelper.getResource(`/api/v1/rental/${nonExistentUuid}`)
            .then(() => done("Incorrectly asserting that a non-existent property exists by a uuid"))
            .catch((err) => {
                assert.equal(err.response.status, 404);
                done();
            })
    });

    it('should return 200 on updating an existing listing resource', (done) => {
        listingRetrievalUseCase.getListings(db, listingCol)
            .then((listings) => {
                listings[0]["listing"]["ber"] = "A3";
                return listings[0]
            })
            .then((listing) => requestHelper.putResource(`/api/v1/rental/${listing["_id"]}`, listing))
            .then((res) => assert.equal(res.status, 200))
            .then(() => listingRetrievalUseCase.getListings(db, listingCol))
            .then(((listings) => {
                assert.equal(listings.length, 1);
                assert.equal(listings[0]["listing"]["ber"], "A3");
                done();
            }))
            .catch((err) => done(err))
    });

    it('should return 400 on updating an existing listing resource with missing parameters', (done) => {
        listingRetrievalUseCase.getListings(db, listingCol)
            .then((listings) => {
                let listing = listings[0];
                delete listing["listing"]["plan"];
                return listing;
            })
            .then((listing) => requestHelper.putResource(`/api/v1/rental/${listing["_id"]}`, listing))
            .then(() => listingRetrievalUseCase.getListings(db, listingCol))
            .then(() => done(new Error("Incorrectly accepting put request for existent listing with bad params")))
            .catch((err) => {
                assert.equal(err.response.status, 400);
                done()
            })
    });

    it('should return 404 on updating a non-existing listing resource', (done) => {
        const nonExistentUuid = ObjectId();
        createListingObject(nonExistentUuid)
            .then((listing) => requestHelper.putResource(`/api/v1/rental/${nonExistentUuid}`, listing))
            .then(() => done(new Error("Incorrectly accepting put request for non existent listing uuid")))
            .catch((err) => {
                assert.equal(err.response.status, 404);
                done()
            })
    });

    it('should return 200 on a landlord deleting a listing that exists successfully', (done) => {
        listingRetrievalUseCase.getListings(db, listingCol)
            .then((listings) => {
                assert.equal(listings.length, 1);
                return listings[0]["_id"]
            })
            .then((uuid) => requestHelper.deleteResource(`/api/v1/rental/${uuid}`))
            .then((res) => assert.equal(res.status, 200))
            .then(() => listingRetrievalUseCase.getListings(db, listingCol))
            .then(((listings) => {
                assert.equal(listings.length, 0);
                done();
            }))
            .catch((err) => done(err))
    });

    it('should return 404 on a landlord deleting a listing that does not exist', (done) => {
        let nonExistingUuid = ObjectId();
        let originalCount = 0;

        listingRetrievalUseCase.getListings(db, listingCol)
            .then((listings) => originalCount = listings.length)
            .then(() => requestHelper.deleteResource(`/api/v1/rental/${nonExistingUuid}`))
            .then(() => done("Incorrectly asserting that a non-existent uuid for a listing was deleted"))
            .catch((err) => {
                assert.equal(err.response.status, 404);
                listingRetrievalUseCase.getListings(db, listingCol)
                    .then(((listings) => {
                        assert.equal(listings.length, originalCount);
                        done();
                    }));
            })
    });
});