let assert = require("assert");
let model = require("../../models/application");

describe("application model tests", () => {
    it('should verify that generated item is valid', (done) => {
        let record = model.generate("userId", "landlordId", "listingId");
        assert.equal(model.validate(record)["error"] === null, true);
        done()
    });

    it('should verify that generated item has status pending', (done) => {
        let record = model.generate("userId", "landlordId", "listingId");
        assert.equal(model.validate(record)["error"] === null, true);
        assert.equal(record["status"], "pending");
        done()
    });

    ["pending", "accepted", "rejected", "ceased"].forEach((status) => {
        it(`should verify that ${status} is a valid application status`, (done) => {
            let record = model.generate("userId", "landlordId", "listingId");
            record["status"] = status;
            assert.equal(model.validate(record)["error"] === null, true);
            done()
        });
    });

    it(`should not verify bad status is valid`, (done) => {
        let record = model.generate("userId", "landlordId", "listingId");
        record["status"] = "bad status";
        assert.equal(model.validate(record)["error"] === null, false);
        done()
    });

    it('should assert that creation_time and last_updated are equal on creation', (done) => {
        let record = model.generate("userId", "landlordId", "listingId");
        assert.equal(model.validate(record)["error"] === null, true);
        assert.deepEqual(record["creation_time"], record["last_updated"]);
        done()
    });
});