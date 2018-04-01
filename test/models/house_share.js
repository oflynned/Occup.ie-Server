let assert = require("assert");
let model = require("../../models/house_share");

describe("house share model tests", () => {
    const landlordUuid = "uuid";
    const address = model.generateAddress("22", "Goldsmith St", "Phibsborough", "Dublin", "Dublin", "D07 FK2W");
    const details = model.generateDetails("apartment", "description", 12, 20, 30, ["male"], ["professional"]);
    const bedrooms = [
        {size: "single", deposit: 500, rent: 500},
        {size: "single", deposit: 500, rent: 500},
        {size: "double", deposit: 750, rent: 750}
    ];
    const bathrooms = ["shared"];
    const facilities = model.generateFacilities(false, true, true, true, true, true, true);
    const listing = model.generateListing("entry", true, true, "A1");

    it("should validate object with correct params", (done) => {
        let object = model.generate(landlordUuid, address, details, bathrooms, bedrooms, facilities, listing);
        let result = model.validate(object)["error"] === null;
        assert.equal(result, true);
        done();
    });

    ["entry", "medium", "deluxe"].forEach((plan) => {
        it(`should validate object with correct plan as ${plan}`, (done) => {
            let listing = model.generateListing(plan, true, true, "A1");
            let object = model.generate(landlordUuid, address, details, bathrooms, bedrooms, facilities, listing);
            let result = model.validate(object)["error"] === null;
            assert.equal(result, true);
            done();
        });
    });

    it(`should not validate object with incorrect plan type`, (done) => {
        let listing = model.generateListing("bad plan", true, true, "A1");
        let object = model.generate(landlordUuid, address, details, bathrooms, bedrooms, facilities, listing);
        let result = model.validate(object)["error"] !== null;
        assert.equal(result, true);
        done();
    });

    ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3", "D1", "D2", "E1", "E2", "F", "G", "Exempt"].forEach((ber) => {
        it(`should validate object with correct ${ber} BER rating`, (done) => {
            let listing = model.generateListing("entry", true, true, ber);
            let object = model.generate(landlordUuid, address, details, bathrooms, bedrooms, facilities, listing);
            let result = model.validate(object)["error"] === null;
            assert.equal(result, true);
            done();
        });
    });

    it(`should not validate object with incorrect BER rating`, (done) => {
        let listing = model.generateListing("entry", true, true, "bad ber rating");
        let object = model.generate(landlordUuid, address, details, bathrooms, bedrooms, facilities, listing);
        let result = model.validate(object)["error"] !== null;
        assert.equal(result, true);
        done();
    });

    ["apartment", "house"].forEach((dwelling) => {
        it(`should validate object with ${dwelling} dwelling type`, (done) => {
            let details = model.generateDetails(dwelling, "description", 12, 20, 30, ["male"], ["professional"]);
            let object = model.generate(landlordUuid, address, details, bathrooms, bedrooms, facilities, listing);
            let result = model.validate(object)["error"] === null;
            assert.equal(result, true);
            done();
        });
    });

    it(`should not validate object with bad dwelling type`, (done) => {
        let details = model.generateDetails("bad dwelling type", "description", 12, 20, 30, ["male"], ["professional"]);
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

    it(`should not validate object with bad bathroom type`, (done) => {
        let bathrooms = ["bad bathroom type"];
        let object = model.generate(landlordUuid, address, details, bathrooms, bedrooms, facilities, listing);
        let result = model.validate(object)["error"] !== null;
        assert.equal(result, true);
        done();
    });

    ["single", "double", "shared"].forEach((bedroom) => {
        it(`should assert that ${bedroom} is a valid bedroom type`, (done) => {
            let bedrooms = [{size: bedroom, rent: 500, deposit: 500}];
            let object = model.generate(landlordUuid, address, details, bathrooms, bedrooms, facilities, listing);
            let result = model.validate(object)["error"] === null;
            assert.equal(result, true);
            done();
        });
    });

    it(`should not validate bad bedroom type`, (done) => {
        let bedrooms = [{size: "bad_bedroom", rent: 500, deposit: 500}];
        let object = model.generate(landlordUuid, address, details, bathrooms, bedrooms, facilities, listing);
        let result = model.validate(object)["error"] !== null;
        assert.equal(result, true);
        done();
    });

    it('should not validate object with min age below 18', (done) => {
        let details = model.generateDetails("apartment", "description", 12, 17, 20, ["male"], ["professional"]);
        let object = model.generate(landlordUuid, address, details, bathrooms, bedrooms, facilities, listing);
        let result = model.validate(object)["error"] !== null;
        assert.equal(result, true);
        done();
    });

    it('should not validate object with max age below 18', (done) => {
        let details = model.generateDetails("apartment", "description", 12, 20, 17, ["male"], ["professional"]);
        let object = model.generate(landlordUuid, address, details, bathrooms, bedrooms, facilities, listing);
        let result = model.validate(object)["error"] !== null;
        assert.equal(result, true);
        done();
    });

    it('should assert that max age must be larger than min age', (done) => {
        let details = model.generateDetails("apartment", "description", 12, 20, 19, ["male"], ["professional"]);
        let object = model.generate(landlordUuid, address, details, bathrooms, bedrooms, facilities, listing);
        let result = model.validate(object)["error"] !== null;
        assert.equal(result, true);
        done();
    });

    it('should not validate object with rent being less than 0', (done) => {
        const rejectedBedrooms = [model.generateBedroom("single", -1, -1)];
        let object = model.generate(landlordUuid, address, details, bathrooms, rejectedBedrooms, facilities, listing);
        let result = model.validate(object)["error"] !== null;
        assert.equal(result, true);
        done();
    });

    it('should not validate object with rent being 0', (done) => {
        const rejectedBedrooms = [model.generateBedroom("single", 0, 0)];
        let object = model.generate(landlordUuid, address, details, bathrooms, rejectedBedrooms, facilities, listing);
        let result = model.validate(object)["error"] !== null;
        assert.equal(result, true);
        done();
    });

    it('should not validate object with rent having a decimal point', (done) => {
        const rejectedBedrooms = [model.generateBedroom("single", 1.23, 1.23)];
        let object = model.generate(landlordUuid, address, details, bathrooms, rejectedBedrooms, facilities, listing);
        assert.equal(object["bedrooms"][0]["rent"], 1);
        done();
    });
});