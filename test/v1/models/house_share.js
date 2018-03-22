let assert = require("assert");
let model = require("../../../routes/v1/models/house_share");

describe("listing model tests", () => {
    it("should validate object with correct params", (done) => {
        let type = "rent";
        let landlordUuid = "uuid";
        let address = model.generateAddress("22", "Goldsmith St", "Phibsborough", "Dublin", "Dublin", "D07 FK2W");
        let details = model.generateDetails("apartment", "description", 12, 20, 30, ["male"], ["professional"]);
        let bedrooms = ["single", "double", "double"];
        let bathrooms = ["shared"];
        let facilities = model.generateFacilities(false, true, true, true, true, true, true);
        let listing = model.generateListing(1000, "entry", true, true, "A1");

        let object = model.generate(type, landlordUuid, address, details, bathrooms, bedrooms, facilities, listing);
        let result = model.validate(object)["error"] === null;
        assert.equal(result, true);
        done();
    });

    ["rent", "house_share"].forEach((listingType) => {
        it(`should validate object with correct listing type as ${listingType}`, (done) => {
            let type = listingType;
            let landlordUuid = "uuid";
            let address = model.generateAddress("22", "Goldsmith St", "Phibsborough", "Dublin", "Dublin", "D07 FK2W");
            let details = model.generateDetails("apartment", "description", 12, 20, 30, ["male"], ["professional"]);
            let bedrooms = ["single", "double", "double"];
            let bathrooms = ["shared"];
            let facilities = model.generateFacilities(false, true, true, true, true, true, true);
            let listing = model.generateListing(1000, "entry", true, true, "A1");

            let object = model.generate(type, landlordUuid, address, details, bathrooms, bedrooms, facilities, listing);
            let result = model.validate(object)["error"] === null;
            assert.equal(result, true);
            done();
        });
    });

    ["entry", "medium", "deluxe"].forEach((plan) => {
        it(`should validate object with correct plan as ${plan}`, (done) => {
            let type = "rent";
            let landlordUuid = "uuid";
            let address = model.generateAddress("22", "Goldsmith St", "Phibsborough", "Dublin", "Dublin", "D07 FK2W");
            let details = model.generateDetails("apartment", "description", 12, 20, 30, ["male"], ["professional"]);
            let bedrooms = ["single", "double", "double"];
            let bathrooms = ["shared"];
            let facilities = model.generateFacilities(false, true, true, true, true, true, true);
            let listing = model.generateListing(1000, "entry", true, true, "A1");

            let object = model.generate(type, landlordUuid, address, details, bathrooms, bedrooms, facilities, listing);
            let result = model.validate(object)["error"] === null;
            assert.equal(result, true);
            done();
        });
    });

    it(`should not validate object with incorrect plan type`, (done) => {
        let type = "rent";
        let landlordUuid = "uuid";
        let address = model.generateAddress("22", "Goldsmith St", "Phibsborough", "Dublin", "Dublin", "D07 FK2W");
        let details = model.generateDetails("apartment", "description", 12, 20, 30, ["male"], ["professional"]);
        let bedrooms = ["single", "double", "double"];
        let bathrooms = ["shared"];
        let facilities = model.generateFacilities(false, true, true, true, true, true, true);
        let listing = model.generateListing(1000, "bad plan", true, true, "A1");

        let object = model.generate(type, landlordUuid, address, details, bathrooms, bedrooms, facilities, listing);
        let result = model.validate(object)["error"] !== null;
        assert.equal(result, true);
        done();
    });

    ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3", "D1", "D2", "E1", "E2", "F", "G", "Exempt"].forEach((ber) => {
        it(`should validate object with correct ${ber} BER rating`, (done) => {
            let type = "rent";
            let landlordUuid = "uuid";
            let address = model.generateAddress("22", "Goldsmith St", "Phibsborough", "Dublin", "Dublin", "D07 FK2W");
            let details = model.generateDetails("apartment", "description", 12, 20, 30, ["male"], ["professional"]);
            let bedrooms = ["single", "double", "double"];
            let bathrooms = ["shared"];
            let facilities = model.generateFacilities(false, true, true, true, true, true, true);
            let listing = model.generateListing(1000, "entry", true, true, ber);

            let object = model.generate(type, landlordUuid, address, details, bathrooms, bedrooms, facilities, listing);
            let result = model.validate(object)["error"] === null;
            assert.equal(result, true);
            done();
        });
    });

    it(`should not validate object with incorrect BER rating`, (done) => {
        let type = "rent";
        let landlordUuid = "uuid";
        let address = model.generateAddress("22", "Goldsmith St", "Phibsborough", "Dublin", "Dublin", "D07 FK2W");
        let details = model.generateDetails("apartment", "description", 12, 20, 30, ["male"], ["professional"]);
        let bedrooms = ["single", "double", "double"];
        let bathrooms = ["shared"];
        let facilities = model.generateFacilities(false, true, true, true, true, true, true);
        let listing = model.generateListing(1000, "entry", true, true, "bad ber rating");

        let object = model.generate(type, landlordUuid, address, details, bathrooms, bedrooms, facilities, listing);
        let result = model.validate(object)["error"] !== null;
        assert.equal(result, true);
        done();
    });

    ["studio", "apartment", "house"].forEach((dwelling) => {
        it(`should validate object with ${dwelling} dwelling type`, (done) => {
            let type = "rent";
            let landlordUuid = "uuid";
            let address = model.generateAddress("22", "Goldsmith St", "Phibsborough", "Dublin", "Dublin", "D07 FK2W");
            let details = model.generateDetails(dwelling, "description", 12, 20, 30, ["male"], ["professional"]);
            let bedrooms = ["single", "double", "double"];
            let bathrooms = ["shared"];
            let facilities = model.generateFacilities(false, true, true, true, true, true, true);
            let listing = model.generateListing(1000, "entry", true, true, "A1");

            let object = model.generate(type, landlordUuid, address, details, bathrooms, bedrooms, facilities, listing);
            let result = model.validate(object)["error"] === null;
            assert.equal(result, true);
            done();
        });
    });

    it(`should not validate object with bad dwelling type`, (done) => {
        let type = "rent";
        let landlordUuid = "uuid";
        let address = model.generateAddress("22", "Goldsmith St", "Phibsborough", "Dublin", "Dublin", "D07 FK2W");
        let details = model.generateDetails("bad dwelling type", "description", 12, 20, 30, ["male"], ["professional"]);
        let bedrooms = ["single", "double", "double"];
        let bathrooms = ["shared"];
        let facilities = model.generateFacilities(false, true, true, true, true, true, true);
        let listing = model.generateListing(1000, "entry", true, true, "A1");

        let object = model.generate(type, landlordUuid, address, details, bathrooms, bedrooms, facilities, listing);
        let result = model.validate(object)["error"] !== null;
        assert.equal(result, true);
        done();
    });

    ["ensuite", "shared"].forEach((bathroom) => {
        it(`should assert that ${bathroom} is a valid bathroom type`, (done) => {
            let type = "rent";
            let landlordUuid = "uuid";
            let address = model.generateAddress("22", "Goldsmith St", "Phibsborough", "Dublin", "Dublin", "D07 FK2W");
            let details = model.generateDetails("apartment", "description", 12, 20, 30, ["male"], ["professional"]);
            let bedrooms = ["single", "double", "double"];
            let bathrooms = [bathroom];
            let facilities = model.generateFacilities(false, true, true, true, true, true, true);
            let listing = model.generateListing(1000, "entry", true, true, "A1");

            let object = model.generate(type, landlordUuid, address, details, bathrooms, bedrooms, facilities, listing);
            let result = model.validate(object)["error"] === null;
            assert.equal(result, true);
            done();
        });
    });

    it(`should not validate object with bad bathroom type`, (done) => {
        let type = "rent";
        let landlordUuid = "uuid";
        let address = model.generateAddress("22", "Goldsmith St", "Phibsborough", "Dublin", "Dublin", "D07 FK2W");
        let details = model.generateDetails("apartment", "description", 12, 20, 30, ["male"], ["professional"]);
        let bedrooms = ["single", "double", "double"];
        let bathrooms = ["bad bathroom type"];
        let facilities = model.generateFacilities(false, true, true, true, true, true, true);
        let listing = model.generateListing(1000, "entry", true, true, "A1");

        let object = model.generate(type, landlordUuid, address, details, bathrooms, bedrooms, facilities, listing);
        let result = model.validate(object)["error"] !== null;
        assert.equal(result, true);
        done();
    });

    ["single", "double", "twin"].forEach((bedroom) => {
        it(`should assert that ${bedroom} is a valid bedroom type`, (done) => {
            let type = "rent";
            let landlordUuid = "uuid";
            let address = model.generateAddress("22", "Goldsmith St", "Phibsborough", "Dublin", "Dublin", "D07 FK2W");
            let details = model.generateDetails("apartment", "description", 12, 20, 30, ["male"], ["professional"]);
            let bedrooms = [bedroom];
            let bathrooms = ["shared"];
            let facilities = model.generateFacilities(false, true, true, true, true, true, true);
            let listing = model.generateListing(1000, "entry", true, true, "A1");

            let object = model.generate(type, landlordUuid, address, details, bathrooms, bedrooms, facilities, listing);
            let result = model.validate(object)["error"] === null;
            assert.equal(result, true);
            done();
        });
    });

    it(`should not validate bad bedroom type`, (done) => {
        let type = "rent";
        let landlordUuid = "uuid";
        let address = model.generateAddress("22", "Goldsmith St", "Phibsborough", "Dublin", "Dublin", "D07 FK2W");
        let details = model.generateDetails("apartment", "description", 12, 20, 30, ["male"], ["professional"]);
        let bedrooms = ["bad bedroom"];
        let bathrooms = ["shared"];
        let facilities = model.generateFacilities(false, true, true, true, true, true, true);
        let listing = model.generateListing(1000, "entry", true, true, "A1");

        let object = model.generate(type, landlordUuid, address, details, bathrooms, bedrooms, facilities, listing);
        let result = model.validate(object)["error"] !== null;
        assert.equal(result, true);
        done();
    });

    it('should not validate object with min age below 18', (done) => {
        let type = "rent";
        let landlordUuid = "uuid";
        let address = model.generateAddress("22", "Goldsmith St", "Phibsborough", "Dublin", "Dublin", "D07 FK2W");
        let details = model.generateDetails("apartment", "description", 12, 17, 20, ["male"], ["professional"]);
        let bedrooms = ["single"];
        let bathrooms = ["separate"];
        let facilities = model.generateFacilities(false, true, true, true, true, true, true);
        let listing = model.generateListing(1000, "entry", true, true, "A1");

        let object = model.generate(type, landlordUuid, address, details, bathrooms, bedrooms, facilities, listing);
        let result = model.validate(object)["error"] !== null;
        assert.equal(result, true);
        done();
    });

    it('should not validate object with max age below 18', (done) => {
        let type = "rent";
        let landlordUuid = "uuid";
        let address = model.generateAddress("22", "Goldsmith St", "Phibsborough", "Dublin", "Dublin", "D07 FK2W");
        let details = model.generateDetails("apartment", "description", 12, 20, 17, ["male"], ["professional"]);
        let bedrooms = ["single"];
        let bathrooms = ["separate"];
        let facilities = model.generateFacilities(false, true, true, true, true, true, true);
        let listing = model.generateListing(1000, "entry", true, true, "A1");

        let object = model.generate(type, landlordUuid, address, details, bathrooms, bedrooms, facilities, listing);
        let result = model.validate(object)["error"] !== null;
        assert.equal(result, true);
        done();
    });

    it('should assert that max age must be larger than min age', (done) => {
        let type = "rent";
        let landlordUuid = "uuid";
        let address = model.generateAddress("22", "Goldsmith St", "Phibsborough", "Dublin", "Dublin", "D07 FK2W");
        let details = model.generateDetails("apartment", "description", 12, 20, 18, ["male"], ["professional"]);
        let bedrooms = ["single"];
        let bathrooms = ["separate"];
        let facilities = model.generateFacilities(false, true, true, true, true, true, true);
        let listing = model.generateListing(1000, "entry", true, true, "A1");

        let object = model.generate(type, landlordUuid, address, details, bathrooms, bedrooms, facilities, listing);
        let result = model.validate(object)["error"] !== null;
        assert.equal(result, true);
        done();
    });

    it('should not validate object with rent being less than 0', (done) => {
        let type = "rent";
        let landlordUuid = "uuid";
        let address = model.generateAddress("22", "Goldsmith St", "Phibsborough", "Dublin", "Dublin", "D07 FK2W");
        let details = model.generateDetails("apartment", "description", 12, 20, 18, ["male"], ["professional"]);
        let bedrooms = ["single"];
        let bathrooms = ["separate"];
        let facilities = model.generateFacilities(false, true, true, true, true, true, true);
        let listing = model.generateListing(-1000, "entry", true, true, "A1");

        let object = model.generate(type, landlordUuid, address, details, bathrooms, bedrooms, facilities, listing);
        let result = model.validate(object)["error"] !== null;
        assert.equal(result, true);
        done();
    });

    it('should not validate object with rent being 0', (done) => {
        let type = "rent";
        let landlordUuid = "uuid";
        let address = model.generateAddress("22", "Goldsmith St", "Phibsborough", "Dublin", "Dublin", "D07 FK2W");
        let details = model.generateDetails("apartment", "description", 12, 20, 18, ["male"], ["professional"]);
        let bedrooms = ["single"];
        let bathrooms = ["separate"];
        let facilities = model.generateFacilities(false, true, true, true, true, true, true);
        let listing = model.generateListing(0, "entry", true, true, "A1");

        let object = model.generate(type, landlordUuid, address, details, bathrooms, bedrooms, facilities, listing);
        let result = model.validate(object)["error"] !== null;
        assert.equal(result, true);
        done();
    });

    it('should not validate object with rent having a decimal point', (done) => {
        let type = "rent";
        let landlordUuid = "uuid";
        let address = model.generateAddress("22", "Goldsmith St", "Phibsborough", "Dublin", "Dublin", "D07 FK2W");
        let details = model.generateDetails("apartment", "description", 12, 20, 18, ["male"], ["professional"]);
        let bedrooms = ["single"];
        let bathrooms = ["separate"];
        let facilities = model.generateFacilities(false, true, true, true, true, true, true);
        let listing = model.generateListing(1.23, "entry", true, true, "A1");
        let object = model.generate(type, landlordUuid, address, details, bathrooms, bedrooms, facilities, listing);

        assert.equal(object["listing"]["rent"], 1);
        done();
    });
});