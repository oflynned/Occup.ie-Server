let expect = require("expect");
let model = require("../../models/landlord");
const birthday = new Date(1960, 1, 1);
let landlord = model.generate("John", "Smith", birthday, "male", "+353861231234");

describe("landlord model tests", () => {
    it("should validate landlord with correct account params", (done) => {
        let outcome = model.validateModel(landlord)["error"] == null;
        expect(outcome).toBe(true);
        done();
    });

    it('should fail landlord validation with incorrect account params', (done) => {
        let landlord = {bad: "param"};
        let outcome = model.validateModel(landlord)["error"] === null;
        expect(outcome).toBe(false);
        done();
    });

    it("should fail landlord validation with bad email param", (done) => {
        landlord.details.email = "not_an_email";
        let outcome = model.validateModel(landlord)["error"] === null;
        expect(outcome).toBe(false);
        done();
    });

    it('should fail landlord validation with missing oauth provider', (done) => {
        delete landlord.oauth.oauth_provider;
        let outcome = model.validate(landlord)["error"] === null;
        expect(outcome).toBe(false);
        done();
    });

    it('should fail landlord validation with missing oauth id', (done) => {
        delete landlord.oauth.oauth_id;
        let outcome = model.validate(landlord)["error"] === null;
        expect(outcome).toBe(false);
        done();
    });

    it('should fail landlord validation with age below age 18', (done) => {
        landlord.details.dob = new Date();
        let outcome = model.validate(landlord)["error"] === null;
        expect(outcome).toBe(false);
        done();
    });
});