let assert = require("assert");

const config = require('../../../config/db');
const db = require('monk')(config.mongoUrl);
const collection = require("../../../config/collections").development.users;

let model = require("../../../models/user");
let useCase = require("../../../models/use_cases/user/user_account_creation");
const birthday = new Date(1960, 1, 1);

function dropDb() {
    db.get(collection).drop();
}

describe("user account creation tests", () => {
    before(() => dropDb());
    afterEach(() => dropDb());

    it("should follow user schema for generating account", (done) => {
        let user = model.generate("John", "Smith", birthday, "male", "professional");
        useCase.validatePayload(user)
            .then(() => useCase.createAccount(db, collection, user))
            .then((record) => {
                assert.equal(record, user);
                assert.equal(record["meta"]["identity_verified"], false);
                done();
            })
            .catch((err) => done(err.message));
    });

    it("should throw an error on account missing params", (done) => {
        let user = model.generate("John", "Smith", birthday, "male", "professional");
        delete user["details"]["forename"];

        useCase.validatePayload(user)
            .then(() => done(new Error("incorrectly validated a wrong payload")))
            .catch(() => done());
    });

    it("should discard junk params provided to user account creation", (done) => {
        let user = model.generate("John", "Smith", birthday, "male", "professional");
        user["parameter"] = "junk";

        let result = model.validateModel(user);
        assert.equal(result["error"] !== null, true);

        delete user["parameter"];
        result = model.validateModel(user);
        assert.equal(result["error"] === null, true);

        done();
    });
});