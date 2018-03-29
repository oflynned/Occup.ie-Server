let assert = require("assert");

const config = require('../../../../config/db');
const db = require('monk')(config.mongoUrl);
const collection = require("../../../../config/collections").development.landlords;

let model = require("../../../../models/landlord");
let useCase = require("../../../../models/use_cases/landlord/landlord_account_creation");
const birthday = new Date(1960, 1, 1);

function dropDb() {
    db.get(collection).drop();
}

describe("landlord account creation tests", () => {
    before(() => dropDb());
    afterEach(() => dropDb());

    it("should follow landlord schema for generate account", (done) => {
        let landlord = model.generate("John", "Smith", birthday, "john.smith@test.com", "+353 86 123 4567");
        useCase.validatePayload(landlord)
            .then(() => useCase.createAccount(db, collection, landlord))
            .then((record) => {
                assert.equal(record, landlord);
                assert.equal(record["meta"]["phone_verified"], false);
                assert.equal(record["meta"]["identity_verified"], false);
                done();
            })
            .catch((err) => done(err.message));
    });

    it("should throw an error on account missing params", (done) => {
        let landlord = model.generate("John", "Smith", birthday, "john.smith@test.com", "+353 86 123 4567");
        delete landlord["details"]["forename"];

        useCase.validatePayload(landlord)
            .then(() => done(new Error("incorrectly validated a wrong payload")))
            .catch(() => done());
    });

    it("should discard junk params provided to landlord account creation", (done) => {
        let landlord = model.generate("John", "Smith", birthday, "john.smith@test.com", "+353 86 123 4567");
        landlord["parameter"] = "junk";

        let result = model.validateModel(landlord);
        assert.equal(result["error"] !== null, true);

        delete landlord["parameter"];
        result = model.validateModel(landlord);
        assert.equal(result["error"] === null, true);

        done();
    });
});