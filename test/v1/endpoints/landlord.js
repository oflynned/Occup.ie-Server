const assert = require("assert");
const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const ObjectId = require("mongodb").ObjectId;

const config = require('../../../config/db');
const db = require('monk')(config.mongoUrl);
const env = require("../../../config/collections").test;
const collection = env.landlords;

const model = require("../../../routes/v1/models/landlord");
const creationUseCase = require("../../../routes/v1/use_cases/landlord/landlord_account_creation");
const retrievalUseCase = require("../../../routes/v1/use_cases/landlord/landlord_account_retrieval");
const helper = require("./helper");

function dropDb() {
    return db.get(collection).drop()
}

function seedDb() {
    const landlord1 = model.generate("John", "Smith", "john.smith@test.com", "0");
    const landlord2 = model.generate("Emma", "Sheeran", "emma.sheeran@test.com", "1");
    const landlord3 = model.generate("Edmond", "Ó Floinn", "edmond.ofloinn@test.com", "2");

    return Promise.all([
        creationUseCase.createAccount(db, collection, landlord1),
        creationUseCase.createAccount(db, collection, landlord2),
        creationUseCase.createAccount(db, collection, landlord3)
    ]);
}

describe("api landlord account management", () => {
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

    it('should return status 201 and new resource if creating a new landlord', (done) => {
        let newLandlord = model.generate("New", "Landlord", "new.user@test.com", "4");

        dropDb()
            .then(() => retrievalUseCase.getLandlords(db, collection))
            .then((landlords) => assert.equal(landlords.length, 0))
            .then(() => helper.postResource(`/api/v1/landlord`, newLandlord))
            .then((res) => {
                assert.equal(res.status, 201);
                done();
            })
            .catch((err) => done(err))
    });

    it('should return 400 for missing parameters on creating a new landlord', (done) => {
        let newLandlord = model.generate("New", "User", "new.user@test.com", "4");
        delete newLandlord["forename"];

        helper.postResource(`/api/v1/landlord`, newLandlord)
            .then(() => done(new Error("Failed validation for incorrect parameters on landlord creation")))
            .catch((err) => {
                assert.equal(err.response.status, 400);
                done()
            })
    });

    it("should return a list and status 200 if requesting existing landlords", (done) => {
        helper.getResource("/api/v1/landlord")
            .then((res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.length, 3);
                done()
            })
            .catch((err) => done(err))
    });

    it("should return an existing landlord and status 200 if requesting an existing landlord uuid", (done) => {
        retrievalUseCase.getLandlords(db, collection, {forename: "Emma"})
            .then((record) => record[0]["_id"])
            .then((uuid) => `/api/v1/landlord/${uuid}`)
            .then((endpoint) => helper.getResource(endpoint))
            .then((res) => {
                assert.equal(res.status, 200);
                assert.equal([res.body].length, 1);
                done()
            })
            .catch((err) => done(err))
    });

    it("should return status 404 if requesting a non-existing landlord by uuid", (done) => {
        const nonExistentUuid = ObjectId();
        helper.getResource(`/api/v1/landlord/${nonExistentUuid}`)
            .then((res) => {
                done("Failure by accepting validation of non-existent resource!")
            })
            .catch((err) => {
                assert.equal(err.response.status, 404);
                assert.equal(err.response.body.length, 0);
                done()
            });
    });

    it('should return status 200 and updated resource if updating resource', (done) => {
        let uuid = -1;
        let updatedRecord = {};

        retrievalUseCase.getLandlords(db, collection, {forename: "Emma"})
            .then((recordList) => recordList[0])
            .then((record) => {
                assert.equal(record.forename, "Emma");
                record["forename"] = "ammE";
                return record
            })
            .then((record) => {
                uuid = record["_id"];
                updatedRecord = record;
            })
            .then(() => helper.putResource(`/api/v1/landlord/${uuid}`, updatedRecord))
            .then((res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.forename, "ammE");

                delete res.body["_id"];
                delete updatedRecord["_id"];
                assert.deepEqual(res.body, updatedRecord);

                done();
            })
            .catch((err) => done(err))
    });

    it('should return status 200 if deleting resource and assert old record is gone', (done) => {
        let deletedRecord = {};

        retrievalUseCase.getLandlords(db, collection, {forename: "Emma"})
            .then((records) => {
                deletedRecord = records[0];
                return deletedRecord["_id"]
            })
            .then((uuid) => helper.deleteResource(`/api/v1/landlord/${uuid}`))
            .then((res) => {
                assert.equal(res.status, 200);
                return retrievalUseCase.getLandlords(db, collection)
            })
            .then((landlords) => {
                assert.equal(landlords.length, 2);
                assert.equal(!(deletedRecord in landlords), true);
                done()
            })
    });
});