const model = require("../../../../routes/v1/models/landlord");
const creationUseCase = require("../../../../routes/v1/use_cases/landlord/landlord_account_creation");

const chai = require("chai");
const env = require("../../../../config/collections").test;
const app = require("../../../../app")(env);

function dropDb(db, collection) {
    return db.get(collection).drop()
}

function seedDb(db, collection) {
    const landlord1 = model.generate("John", "Smith", "john.smith@test.com", "0");
    const landlord2 = model.generate("Emma", "Sheeran", "emma.sheeran@test.com", "1");
    const landlord3 = model.generate("Edmond", "O'Flynn", "edmond.oflynn@test.com", "2");

    return Promise.all([
        creationUseCase.createAccount(db, collection, landlord1),
        creationUseCase.createAccount(db, collection, landlord2),
        creationUseCase.createAccount(db, collection, landlord3)
    ]);
}

function getResource(endpoint) {
    return new Promise((res, rej) => {
        chai.request(app)
            .get(endpoint)
            .then((response) => res(response))
            .catch((err) => rej(err))
    })
}

function putResource(endpoint, data) {
    return new Promise((res, rej) => {
        chai.request(app)
            .put(endpoint)
            .set('content-type', 'application/json')
            .send(data)
            .then((response) => res(response))
            .catch((err) => rej(err))
    })
}

module.exports = {
    dropDb: dropDb,
    seedDb: seedDb,
    getResource: getResource,
    putResource: putResource
};