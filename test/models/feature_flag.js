let expect = require("expect");
let model = require("../../models/feature_flag");

describe("feature flag model tests", () => {
    it("should validate object with correct params", (done) => {
        let flag = model.generate("title", "description", true);
        let outcome = model.validate(flag)["error"] === null;
        expect(outcome).toBe(true);
        done();
    });

    it("should not validate object with bad enabled param", (done) => {
        let flag = model.generate("title", "description", "bad param");
        let outcome = model.validate(flag)["error"] === null;
        expect(outcome).toBe(false);
        done();
    });

    it("should set date on flag creation", (done) => {
        let flag = model.generate("title", "description", true);
        expect(isNaN(new Date(flag.time_updated.getDate()))).toBe(false);
        done();
    });
});