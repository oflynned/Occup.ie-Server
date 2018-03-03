let assert = require("assert");
let chai = require("chai");
let should = require("should");

const config = require('../../../../config/db');
const db = require('monk')(config.mongoUrl);
const collection = require("../../../../routes/v1/common/collections").development.landlords;

let model = require("../../../../routes/v1/models/landlord");
let useCase = require("../../../../routes/v1/use_cases/landlord/landlord_account_validation");

describe("landlord account validation tests", () => {
    it("verifying a phone number should set phone validation to true", (done) => {
        done();
    });

    it("verifying a passport should set the id validation to true", (done) => {
        done();
    });
});
