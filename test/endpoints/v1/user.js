const assert = require("assert");
const chai = require("chai");
const chaiHttp = require("chai-http");
const ObjectId = require("mongodb").ObjectId;

const sinon = require("sinon");
let app, oauth;

const config = require('../../../config/db');
const db = require('monk')(config.mongoUrl);
const env = require("../../../config/collections").test;
const collection = env.users;

const requestHelper = require("./request_helper");
const model = require("../../../models/user");
const creationUseCase = require("../../../models/use_cases/user/user_account_creation");
const retrievalUseCase = require("../../../models/use_cases/user/user_account_retrieval");

const birthday = new Date(1994, 1, 1);
const headers = {
    oauth_id: "facebook_id",
    oauth_token: "facebook_token",
    oauth_provider: "facebook"
};

function dropDb() {
    return db.get(collection).drop()
}

function seedDb() {
    const user1 = model.generate("John", "Smith", birthday, "other", "student");
    const user2 = model.generate("Emma", "Sheeran", birthday, "female", "student");
    const user3 = model.generate("Edmond", "Ó Floinn", birthday, "male", "professional");

    return Promise.all([
        creationUseCase.createAccount(db, collection, user1),
        creationUseCase.createAccount(db, collection, user2),
        creationUseCase.createAccount(db, collection, user3)
    ]);
}

describe("api user account management", () => {
    beforeEach((done) => {
        dropDb()
            .then(() => seedDb())
            .then(() => {
                oauth = require('../../../common/oauth')(env, db);
                sinon.stub(oauth, 'denyInvalidRequests').callsFake((req, res, next) => next());
                sinon.stub(oauth, 'denyMismatchingAccounts').callsFake((req, res, next) => next());
                app = require('../../../app')(env);
                chai.use(chaiHttp);
                done()
            })
            .catch((err) => done(err))
    });

    afterEach((done) => {
        dropDb()
            .then(() => oauth.denyInvalidRequests.restore())
            .then(() => oauth.denyMismatchingAccounts.restore())
            .then(() => done())
            .catch((err) => done(err));
    });

    it('should return status 200 if creating a user that already exists', (done) => {
        const existingUser = model.generate("John", "Smith", birthday, "other", "student");
        requestHelper.postResource(app, headers, `/api/v1/user`, existingUser)
            .then((res) => assert.equal(res.status, 200))
            .then(() => done())
            .catch((err) => done(err));
    });

    it('should return status 201 and new resource if creating a new user', (done) => {
        const newUser = model.generate("New", "User", birthday, "other", "professional");
        dropDb()
            .then(() => requestHelper.postResource(app, headers, `/api/v1/user`, newUser))
            .then((res) => assert.equal(res.status, 201))
            .then(() => done())
            .catch((err) => done(err));
    });

    it('should return 400 for missing parameters on creating a new user', (done) => {
        const newUser = model.generate("New", "User", birthday, "other", "professional");
        delete newUser["details"]["forename"];

        requestHelper.postResource(app, headers, `/api/v1/user`, newUser)
            .then(() => done(new Error("Failed validation for incorrect parameters on user creation")))
            .catch((err) => {
                assert.equal(err.response.status, 400);
                done()
            })
    });

    it('should return status 401 if creating a user that with a bad oauth id', (done) => {
        done();
    });

    it('should return status 401 if creating a user that with invalid token', (done) => {
        done();
    });

    it('should return 403 forbidden for users signing up under age 18 on creating a new user', (done) => {
        const birthday = new Date(2017, 1, 1);
        const newUser = model.generate("Underage", "User", birthday, "male", "student");

        requestHelper.postResource(app, headers, `/api/v1/user`, newUser)
            .then(() => done("Failed validation for incorrect parameters on user creation"))
            .catch((err) => {
                assert.equal(err.response.status, 403);
                done()
            })
    });

    it("should return a list and status 200 if requesting existing users", (done) => {
        requestHelper.getResource(app, headers, "/api/v1/user")
            .then((res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.length, 3);
                done()
            })
            .catch((err) => done(err))
    });

    it("should return an existing user and status 200 if requesting an existing user uuid", (done) => {
        retrievalUseCase.getUsers(db, collection, {"details.forename": "Emma"})
            .then((records) => records[0]["_id"])
            .then((uuid) => `/api/v1/user/${uuid}`)
            .then((endpoint) => requestHelper.getResource(app, headers, endpoint))
            .then((res) => {
                assert.equal(res.status, 200);
                assert.equal([res.body].length, 1);
                done()
            })
            .catch((err) => done(err))
    });

    it("should return status 404 if requesting a non-existing user by uuid", (done) => {
        const nonExistentUuid = ObjectId();
        requestHelper.getResource(app, headers, `/api/v1/user/${nonExistentUuid}`)
            .then(() => done("Failure by accepting validation of non-existent resource!"))
            .catch((err) => {
                assert.equal(err.response.status, 404);
                done()
            });
    });

    it('should return status 200 and updated resource if updating resource', (done) => {
        let uuid = -1;
        let updatedRecord = {};

        retrievalUseCase.getUsers(db, collection, {"details.forename": "Emma"})
            .then((recordList) => recordList[0])
            .then((record) => {
                assert.equal(record.details.forename, "Emma");
                record["details"]["forename"] = "ammE";
                return record
            })
            .then((record) => {
                uuid = record["_id"];
                updatedRecord = record;
            })
            .then(() => requestHelper.patchResource(app, headers, `/api/v1/user/${uuid}`, updatedRecord))
            .then((res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.details.forename, "ammE");
                done();
            })
            .catch((err) => done(err))
    });

    it('should return status 200 if deleting resource and assert old record is gone', (done) => {
        let deletedRecord = {};

        retrievalUseCase.getUsers(db, collection, {"details.forename": "Emma"})
            .then((records) => {
                deletedRecord = records[0];
                return deletedRecord["_id"]
            })
            .then((uuid) => requestHelper.deleteResource(app, headers, `/api/v1/user/${uuid}`))
            .then((res) => {
                assert.equal(res.status, 200);
                return retrievalUseCase.getUsers(db, collection)
            })
            .then((users) => {
                assert.equal(users.length, 2);
                assert.equal(!(users.includes(deletedRecord)), true);
                done()
            })
    });

    it('should return status 404 if deleting non-existent resource', (done) => {
        requestHelper.deleteResource(app, headers, `/api/v1/user/${ObjectId()}`)
            .then(() => done(new Error("Falsely deleted non-existing user resource")))
            .catch((err) => {
                assert.equal(err.response.status, 404);
                done()
            })
    });
});