let assert = require("assert");

const config = require('../../../../config/db');
const db = require('monk')(config.mongoUrl);
const collection = require("../../../../config/collections").development.landlords;

let model = require("../../../../routes/v1/models/landlord");
let useCase = require("../../../../routes/v1/use_cases/landlord/landlord_account_creation");

function dropDb() {
    db.get(collection).drop();
}

describe("landlord account creation tests", () => {
    before(() => dropDb());
    afterEach(() => dropDb());

    it("should follow landlord schema for generate account", (done) => {
        let landlord = model.generate("John", "Smith", "john.smith@test.com", "+353 86 123 4567");
        model.validate(landlord);
        useCase.createAccount(db, collection, landlord)
            .then((record) => {
                assert.equal(record, landlord);
                assert.equal(record["phone_verified"], false);
                assert.equal(record["identity_verified"], false);
                done();
            })
            .catch((err) => done(err));
    });

    it("should throw an error on missing params", (done) => {
        let landlord = model.generate("John", "Smith", "john.smith@test.com", "+353 86 123 4567");
        delete landlord["forename"];
        model.validate(landlord)
            .then(() => done(new Error("landlord schema incorrectly validated")))
            .catch((err) => done())
    });

    it("should discard junk params", (done) => {
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