let assert = require("assert");
let chai = require("chai");
let should = require("should");

const config = require('../../../../config/db');
const db = require('monk')(config.mongoUrl);
const collection = require("../../../../routes/v1/common/collections").development.landlords;

let model = require("../../../../routes/v1/models/landlord");
let useCase = require("../../../../routes/v1/use_cases/landlord/landlord_account_creation");

function dropDb() {
    db.get(collection).drop();
}

describe("landlord account creation tests", () => {
    before(() => dropDb());
    afterEach(() => dropDb());

    it("generated landlord should follow schema", (done) => {
        let landlord = model.generate("John", "Smith", "john.smith@test.com", "+353 86 123 4567");
        model.validate(landlord);
        useCase.createAccount(db, landlord, collection)
            .then((record) => {
                assert.equal(record, landlord);
                assert.equal(record["phone_verified"], false);
                assert.equal(record["identity_verified"], false);
                done();
            })
            .catch((err) => done(err));
    });

    it("missing params should throw an error", (done) => {
        let landlord = model.generate("John", "Smith", "john.smith@test.com", "+353 86 123 4567");
        delete landlord["forename"];
        model.validate(landlord)
            .then(() => {
                done(new Error("landlord schema incorrectly validated"));
            })
            .catch((err) => done())
    });

    it("junk params should be discarded", (done) => {
        let landlord = model.generate("John", "Smith", "john.smith@test.com", "+353 86 123 4567");
        landlord["parameter"] = "junk";

        model.validate(landlord);
        let record = useCase.generateLandlordObject(landlord);

        assert.notEqual(record, landlord);
        assert.equal("parameter" in landlord, true);
        delete landlord["parameter"];
        assert.deepEqual(record, landlord);

        done();
    });
});