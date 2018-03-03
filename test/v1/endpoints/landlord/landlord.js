const assert = require("assert");
const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const ObjectId = require("mongodb").ObjectId;

const config = require('../../../../config/db');
const db = require('monk')(config.mongoUrl);
const env = require("../../../../config/collections").test;
const collection = env.landlords;

const retrievalUseCase = require("../../../../routes/v1/use_cases/landlord/landlord_account_retrieval");
const helper = require("./helper");

describe("api landlord account creation", () => {
    beforeEach((done) => {
        helper.dropDb(db, collection)
            .then(() => helper.seedDb(db, collection))
            .then(() => {
                chai.use(chaiHttp);
                done()
            })
            .catch((err) => done(err))
    });

    afterEach((done) => {
        helper.dropDb(db, collection).then(() => done()).catch((err) => done(err));
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
        retrievalUseCase.getLandlords(db, collection, {"forename": "Emma"})
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

    it("return status 404 if requesting a non-existing landlord by uuid", (done) => {
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

        retrievalUseCase.getLandlords(db, collection, {"forename": "Emma"})
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
});