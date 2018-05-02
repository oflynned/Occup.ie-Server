let expect = require("expect");
let model = require("../../models/landlord");
const birthday = new Date(1960, 1, 1);

// TODO should check for validity of phone number & email
describe("landlord model tests", () => {
    it("should validate landlord with correct account params", (done) => {
        let landlord = model.generate("John", "Smith", birthday, "john.smith@test.com", "+353 86 123 4567");
        let outcome = model.validateModel(landlord)["error"] === null;
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
        let landlord = model.generate("John", "Smith", birthday, "john.smith@test.com", "+353 86 123 4567");
        landlord.details.email = "not_an_email";
        let outcome = model.validateModel(landlord)["error"] === null;
        expect(outcome).toBe(false);
        done();
    });

    it('should fail landlord validation with missing oauth provider', (done) => {
        let landlord = model.generate("John", "Smith", birthday, "john.smith@test.com", "+353 86 123 4567");
        delete landlord.oauth.oauth_provider;
        let outcome = model.validate(landlord)["error"] === null;
        expect(outcome).toBe(false);
        done();
    });

    it('should fail landlord validation with missing oauth id', (done) => {
        let landlord = model.generate("John", "Smith", birthday, "john.smith@test.com", "+353 86 123 4567");
        delete landlord.oauth.oauth_id;
        let outcome = model.validate(landlord)["error"] === null;
        expect(outcome).toBe(false);
        done();
    });

    it('should fail landlord validation with age below age 18', (done) => {
        let landlord = model.generate("John", "Smith", new Date(), "john.smith@test.com", "+353 86 123 4567");
        delete landlord.oauth.oauth_id;
        let outcome = model.validate(landlord)["error"] === null;
        expect(outcome).toBe(false);
        done();
    });

    it('should fail landlord validation if email is invalid', (done) => {
        done();
    });

    it('should fail landlord validation if phone number is invalid', (done) => {
        done();
    });
});