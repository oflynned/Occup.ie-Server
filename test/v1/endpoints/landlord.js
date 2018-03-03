const assert = require("assert");
const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;

const app = require("../../../app");
const config = require('../../../config/db');
const db = require('monk')(config.mongoUrl);
const collection = require("../../../routes/v1/common/collections").development.landlords;

const creationUseCase = require("../../../routes/v1/use_cases/landlord/landlord_account_creation");
const retrievalUseCase = require("../../../routes/v1/use_cases/landlord/landlord_account_retrieval");

function dropDb() {
    db.get(collection).drop();
}

describe("api landlord account creation", () => {
    beforeEach(() => {
        chai.use(chaiHttp);
        dropDb()
    });

    afterEach(() => dropDb());

    it("requesting a landlord by id should return 200", (done) => {
        chai.request(app)
            .get("/api/v1/landlord")
            .then((res) => {
                expect(res.status).to.equal(200);
                done();
            });
    });
});