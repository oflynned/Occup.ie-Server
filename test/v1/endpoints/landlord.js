const assert = require("assert");
const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;

const config = require('../../../config/db');
const db = require('monk')(config.mongoUrl);
const env = require("../../../config/collections").test;
const collection = env.landlords;
const app = require("../../../app")(env);

const model = require("../../../routes/v1/models/landlord");
const creationUseCase = require("../../../routes/v1/use_cases/landlord/landlord_account_creation");
const retrievalUseCase = require("../../../routes/v1/use_cases/landlord/landlord_account_retrieval");

function dropDb() {
    db.get(collection).drop();
}

function seedDb() {
    let landlord1 = model.generate("John", "Smith", "john.smith@test.com", "0");
    let landlord2 = model.generate("Emma", "Sheeran", "emma.sheeran@test.com", "1");
    let landlord3 = model.generate("Edmond", "O'Flynn", "edmond.oflynn@test.com", "2");

    creationUseCase.createAccount(db, collection, landlord1);
    creationUseCase.createAccount(db, collection, landlord2);
    creationUseCase.createAccount(db, collection, landlord3);
}

describe("api landlord account creation", () => {
    before(() => {
        chai.use(chaiHttp);
        dropDb();
        seedDb();
    });

    after(() => dropDb());

    it("requesting a landlord by id should return 200", (done) => {
        chai.request(app)
            .get("/api/v1/landlord")
            .then((res) => {
                assert.equal(res.status, 200);
                console.log(res.body);
                done();
            })
            .catch((err) => done(err))
    });
});