let assert = require("assert");
let chai = require("chai");
let should = require("should");

const config = require('../../../../config/db');
const db = require('monk')(config.mongoUrl);
const collection = require("../../../../config/collections").development.listings;

let model = require("../../../../routes/v1/models/landlord");
let useCase = require("../../../../routes/v1/use_cases/landlord/landlord_account_validation");

describe("landlord account validation tests", () => {

});
