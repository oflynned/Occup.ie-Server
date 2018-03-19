let assert = require("assert");
let model = require("../../../routes/v1/models/landlord");
const birthday = new Date(1960, 1, 1);

describe("landlord model tests", () => {
    it("should validate object with correct account params", (done) => {
        let landlord = model.generate("John", "Smith", birthday, "john.smith@test.com", "+353 86 123 4567");
        let outcome = model.validate(landlord)["error"] === null;
        assert.equal(outcome, true);
        done();
    });

    it('should fail object validation with incorrect account params', (done) => {
        let landlord = {bad: "params"};
        let outcome = model.validate(landlord)["error"] !== null;
        assert.equal(outcome, true);
        done();
    });
});