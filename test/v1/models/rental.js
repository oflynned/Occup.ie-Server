let assert = require("assert");
let model = require("../../../routes/v1/models/rental");

describe("listing model tests", () => {
    const landlordUuid = "uuid";
    const address = model.generateAddress("22", "Goldsmith St", "Phibsborough", "Dublin", "Dublin", "D07 FK2W");
    const details = model.generateDetails("apartment", "description", 12, ["individual"]);
    const bedrooms = ["single", "double", "double"];
    const bathrooms = ["shared"];
    const facilities = model.generateFacilities(false, true, true, true, true, true, true);
    const listing = model.generateListing(1000, "entry", true, true, "A1");

    it("should validate object with correct params", (done) => {
        let object = model.generate(landlordUuid, address, details, bathrooms, bedrooms, facilities, listing);
        let result = model.validate(object)["error"] === null;
        assert.equal(result, true);
        done();
    });

    it('should allow validation on both accepted tenant types', (done) => {
        const details = model.generateDetails("apartment", "description", 12, ["individual", "couple"]);
        let object = model.generate(landlordUuid, address, details, bathrooms, bedrooms, facilities, listing);
        let result = model.validate(object)["error"] === null;
        assert.equal(result, true);
        done();
    });

    it('should not allow validation on no tenant types', (done) => {
        const details = model.generateDetails("apartment", "description", 12, []);
        let object = model.generate(landlordUuid, address, details, bathrooms, bedrooms, facilities, listing);
        let result = model.validate(object)["error"] !== null;
        assert.equal(result, true);
        done();
    });

    ["entry", "medium", "deluxe"].forEach((plan) => {
        it(`should validate object with correct plan as ${plan}`, (done) => {
            let listing = model.generateListing(1000, plan, true, true, "A1");
            let object = model.generate(landlordUuid, address, details, bathrooms, bedrooms, facilities, listing);
            let result = model.validate(object)["error"] === null;
            assert.equal(result, true);
            done();
        });
    });

    it('should not validate object with undefined plan type', (done) => {
        let listing = model.generateListing(1000, undefined, true, true, "A1");
        let object = model.generate(landlordUuid, address, details, bathrooms, bedrooms, facilities, listing);
        let result = model.validate(object)["error"] !== null;
        assert.equal(result, true);
        done();
    });

    it('should not validate object with more than one plan type', (done) => {
        let listing = model.generateListing(1000, ["entry", "medium"], true, true, "A1");
        let object = model.generate(landlordUuid, address, details, bathrooms, bedrooms, facilities, listing);
        let result = model.validate(object)["error"] !== null;
        assert.equal(result, true);
        done();
    });

    it(`should not validate object with incorrect plan type`, (done) => {
        let listing = model.generateListing(1000, "bad plan", true, true, "A1");
        let object = model.generate(landlordUuid, address, details, bathrooms, bedrooms, facilities, listing);
        let result = model.validate(object)["error"] !== null;
        assert.equal(result, true);
        done();
    });

    ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3", "D1", "D2", "E1", "E2", "F", "G", "Exempt"].forEach((ber) => {
        it(`should validate object with correct ${ber} BER rating`, (done) => {
            let listing = model.generateListing(1000, "entry", true, true, ber);
            let object = model.generate(landlordUuid, address, details, bathrooms, bedrooms, facilities, listing);
            let result = model.validate(object)["error"] === null;
            assert.equal(result, true);
            done();
        });
    });

    it(`should not validate object with incorrect BER rating`, (done) => {
        let listing = model.generateListing(1000, "entry", true, true, "bad ber rating");
        let object = model.generate(landlordUuid, address, details, bathrooms, bedrooms, facilities, listing);
        let result = model.validate(object)["error"] !== null;
        assert.equal(result, true);
        done();
    });

    it(`should not validate object with undefined BER rating`, (done) => {
        let listing = model.generateListing(1000, "entry", true, true, undefined);
        let object = model.generate(landlordUuid, address, details, bathrooms, bedrooms, facilities, listing);
        let result = model.validate(object)["error"] !== null;
        assert.equal(result, true);
        done();
    });

    it(`should not validate object with multiple BER ratings`, (done) => {
        let listing = model.generateListing(1000, "entry", true, true, ["A1", "A2"]);
        let object = model.generate(landlordUuid, address, details, bathrooms, bedrooms, facilities, listing);
        let result = model.validate(object)["error"] !== null;
        assert.equal(result, true);
        done();
    });

    ["studio", "apartment", "house"].forEach((dwelling) => {
        it(`should validate object with ${dwelling} dwelling type`, (done) => {
            let details = model.generateDetails(dwelling, "description", 12, ["individual"]);
            let object = model.generate(landlordUuid, address, details, bathrooms, bedrooms, facilities, listing);
            let result = model.validate(object)["error"] === null;
            assert.equal(result, true);
            done();
        });
    });

    it(`should not validate object with bad dwelling type`, (done) => {
        let details = model.generateDetails("bad dwelling type", "description", 12, ["individual"]);
        let object = model.generate(landlordUuid, address, details, bathrooms, bedrooms, facilities, listing);
        let result = model.validate(object)["error"] !== null;
        assert.equal(result, true);
        done();
    });

    it(`should not validate object with multiple dwelling types`, (done) => {
        let details = model.generateDetails(["studio", "apartment"], "description", 12, ["individual"]);
        let object = model.generate(landlordUuid, address, details, bathrooms, bedrooms, facilities, listing);
        let result = model.validate(object)["error"] !== null;
        assert.equal(result, true);
        done();
    });

    it(`should not validate object with undefined dwelling type`, (done) => {
        let details = model.generateDetails(undefined, "description", 12, ["individual"]);
        let object = model.generate(landlordUuid, address, details, bathrooms, bedrooms, facilities, listing);
        let result = model.validate(object)["error"] !== null;
        assert.equal(result, true);
        done();
    });

    ["ensuite", "shared"].forEach((bathroom) => {
        it(`should assert that ${bathroom} is a valid bathroom type`, (done) => {
            let bathrooms = [bathroom];
            let object = model.generate(landlordUuid, address, details, bathrooms, bedrooms, facilities, listing);
            let result = model.validate(object)["error"] === null;
            assert.equal(result, true);
            done();
        });
    });

    it(`should validate object with multiple bathroom types`, (done) => {
        let bathrooms = ["ensuite", "ensuite"];
        let object = model.generate(landlordUuid, address, details, bathrooms, bedrooms, facilities, listing);
        let result = model.validate(object)["error"] === null;
        assert.equal(result, true);
        done();
    });

    it(`should not validate object with no bathrooms`, (done) => {
        let object = model.generate(landlordUuid, address, details, [], bedrooms, facilities, listing);
        let result = model.validate(object)["error"] !== null;
        assert.equal(result, true);
        done();
    });

    it(`should not validate object with bad bathroom type`, (done) => {
        let bathrooms = ["bad bathroom type"];
        let object = model.generate(landlordUuid, address, details, bathrooms, bedrooms, facilities, listing);
        let result = model.validate(object)["error"] !== null;
        assert.equal(result, true);
        done();
    });

    ["single", "double", "shared"].forEach((bedroom) => {
        it(`should assert that ${bedroom} is a valid bedroom type`, (done) => {
            let bedrooms = [bedroom];
            let object = model.generate(landlordUuid, address, details, bathrooms, bedrooms, facilities, listing);
            let result = model.validate(object)["error"] === null;
            assert.equal(result, true);
            done();
        });
    });

    it(`should not validate bad bedroom type`, (done) => {
        let bedrooms = ["bad bedroom"];
        let object = model.generate(landlordUuid, address, details, bathrooms, bedrooms, facilities, listing);
        let result = model.validate(object)["error"] !== null;
        assert.equal(result, true);
        done();
    });

    it('should not validate object with rent being less than 0', (done) => {
        let listing = model.generateListing(-1000, "entry", true, true, "A1");
        let object = model.generate(landlordUuid, address, details, bathrooms, bedrooms, facilities, listing);
        let result = model.validate(object)["error"] !== null;
        assert.equal(result, true);
        done();
    });

    it('should not validate object with rent being 0', (done) => {
        let listing = model.generateListing(0, "entry", true, true, "A1");
        let object = model.generate(landlordUuid, address, details, bathrooms, bedrooms, facilities, listing);
        let result = model.validate(object)["error"] !== null;
        assert.equal(result, true);
        done();
    });

    it('should not validate object with rent having a decimal point', (done) => {
        let listing = model.generateListing(1.23, "entry", true, true, "A1");
        let object = model.generate(landlordUuid, address, details, bathrooms, bedrooms, facilities, listing);
        assert.equal(object["listing"]["rent"], 1);
        done();
    });
});