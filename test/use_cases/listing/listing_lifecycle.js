let assert = require("assert");
let chai = require("chai");
let should = require("should");

const config = require('../../../config/db');
const db = require('monk')(config.mongoUrl);
const collection = require("../../../config/collections").development.listings;

let model = require("../../../models/rental");
let useCase = require("../../../models/use_cases/landlord/landlord_account_validation");

describe("listing lifecycle tests", () => {

});
