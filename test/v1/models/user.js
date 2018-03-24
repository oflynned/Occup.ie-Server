let assert = require("assert");
let model = require("../../../routes/v1/models/user");
const birthday = new Date(1960, 1, 1);

describe("user model tests", () => {
    it("should validate object with correct params", (done) => {
        let user = model.generate("John", "Smith", birthday, "male", "student");
        let outcome = model.validate(user)["error"] === null;
        assert.equal(outcome, true);
        done();
    });

    ["male", "female", "other"].forEach((gender) => {
        it(`should validate object with correct gender as ${gender}`, (done) => {
            let user = model.generate("John", "Smith", birthday, gender, "student");
            let outcome = model.validate(user)["error"] === null;
            assert.equal(outcome, true);
            done();
        });
    });

    ["student", "professional"].forEach((profession) => {
        it(`should validate object with correct profession as ${profession}`, (done) => {
            let user = model.generate("John", "Smith", birthday, "male", profession);
            let outcome = model.validate(user)["error"] === null;
            assert.equal(outcome, true);
            done();
        });
    });

    it('should fail object validation with incorrect gender params', (done) => {
        let user = model.generate("John", "Smith", birthday, "apache helicopter", "student");
        let outcome = model.validate(user)["error"] !== null;
        assert.equal(outcome, true);
        done();
    });

    it('should fail object validation with incorrect profession params', (done) => {
        let user = model.generate("John", "Smith", birthday, "male", "circus clown");
        let outcome = model.validate(user)["error"] !== null;
        assert.equal(outcome, true);
        done();
    });

    it('should fail object validation with missing params', (done) => {
        let user = model.generate("John", "Smith", birthday, "male", "student");
        delete user["details"]["forename"];
        let outcome = model.validate(user)["error"] !== null;
        assert.equal(outcome, true);
        done();
    });
});