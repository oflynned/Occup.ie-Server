let expect = require("expect");
let model = require("../../../models/user");
const birthday = new Date(1960, 1, 1);

describe("user model tests", () => {
    it("should validate object with correct params", (done) => {
        let user = model.generate("John", "Smith", birthday, "male", "student");
        let outcome = model.validate(user)["error"] === null;
        expect(outcome).toBe(true);
        done();
    });

    it("should not validate object with bad email param", (done) => {
        let user = model.generate("John", "Smith", birthday, "male", "student");
        user.details.email = "not_an_email";
        let outcome = model.validate(user)["error"] === null;
        expect(outcome).toBe(false);
        done();
    });

    ["male", "female", "other"].forEach((gender) => {
        it(`should validate object with correct gender as ${gender}`, (done) => {
            let user = model.generate("John", "Smith", birthday, gender, "student");
            let outcome = model.validate(user)["error"] === null;
            expect(outcome).toBe(true);
            done();
        });
    });

    it('should fail object validation with incorrect gender params', (done) => {
        let user = model.generate("John", "Smith", birthday, "apache_helicopter", "student");
        let outcome = model.validate(user)["error"] === null;
        expect(outcome).toBe(false);
        done();
    });

    ["student", "professional"].forEach((profession) => {
        it(`should validate object with correct profession as ${profession}`, (done) => {
            let user = model.generate("John", "Smith", birthday, "male", profession);
            let outcome = model.validate(user)["error"] === null;
            expect(outcome).toBe(true);
            done();
        });
    });

    it('should fail object validation with incorrect profession params', (done) => {
        let user = model.generate("John", "Smith", birthday, "male", "circus clown");
        let outcome = model.validate(user)["error"] === null;
        expect(outcome).toBe(false);
        done();
    });

    it('should fail object validation with missing params', (done) => {
        let user = model.generate("John", "Smith", birthday, "male", "student");
        delete user.details.forename;
        let outcome = model.validate(user)["error"] === null;
        expect(outcome).toBe(false);
        done();
    });

    it('should fail object validation with missing oauth provider', (done) => {
        let user = model.generate("John", "Smith", birthday, "male", "student");
        delete user.oauth.oauth_provider;
        let outcome = model.validate(user)["error"] === null;
        expect(outcome).toBe(false);
        done();
    });

    it('should fail object validation with missing oauth id', (done) => {
        let user = model.generate("John", "Smith", birthday, "male", "student");
        delete user.oauth.oauth_id;
        let outcome = model.validate(user)["error"] === null;
        expect(outcome).toBe(false);
        done();
    });
});