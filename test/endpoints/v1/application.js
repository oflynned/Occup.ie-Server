const assert = require("assert");
const chai = require("chai");
const chaiHttp = require("chai-http");
const ObjectId = require("mongodb").ObjectId;

const sinon = require("sinon");
let app, oauth;

const config = require('../../../config/db');
let db = require('monk')(config.mongoUrl);

const env = require("../../../config/collections").test;
const userCol = env.users;
const listingCol = env.listings;
const landlordCol = env.landlords;
const applicationCol = env.applications;

const requestHelper = require("./request_helper");
const userModel = require("../../../models/user");
const rentalModel = require("../../../models/rental");
const houseShareModel = require("../../../models/house_share");
const landlordModel = require("../../../models/landlord");
const applicationModel = require("../../../models/application");

const applicationCreationUseCase = require("../../../models/use_cases/application/application_creation");
const applicationRetrievalUseCase = require("../../../models/use_cases/application/application_retrieval");
const houseShareCreationUseCase = require("../../../models/use_cases/listing/house_share_creation");
const houseShareRetrievalUseCase = require("../../../models/use_cases/listing/house_share_retrieval");
const rentalCreationUseCase = require("../../../models/use_cases/listing/rental_creation");
const rentalRetrievalUseCase = require("../../../models/use_cases/listing/rental_retrieval");
const userCreationUseCase = require("../../../models/use_cases/user/user_account_creation");
const userRetrievalUseCase = require("../../../models/use_cases/user/user_account_retrieval");
const landlordCreationUseCase = require("../../../models/use_cases/landlord/landlord_account_creation");
const landlordRetrievalUseCase = require("../../../models/use_cases/landlord/landlord_account_retrieval");

const birthday = new Date(1994, 1, 1);

const headers = {
    oauth_id: "google_id",
    oauth_token: "google_token",
    oauth_provider: "google"
};

function seedDb() {
    return createLandlord()
        .then((uuid) => createListingObject(uuid))
        .then((listing) => houseShareCreationUseCase.createListing(db, listingCol, listing))
        .then(() => createUsers())
}

function dropDb() {
    return Promise.all([
        db.get(listingCol).drop(),
        db.get(userCol).drop(),
        db.get(landlordCol).drop(),
        db.get(applicationCol).drop()
    ])
}

function getDobFromAge(age) {
    let now = new Date();
    return new Date(now.getFullYear() - age, now.getMonth(), now.getDay());
}

function createUsers() {
    const user1 = userModel.generate("Fitting", "Candidate", getDobFromAge(23), "male", "professional");
    const user2 = userModel.generate("Wrong", "Profession", getDobFromAge(23), "male", "student");
    const user3 = userModel.generate("Too", "Young", getDobFromAge(18), "male", "professional");
    const user4 = userModel.generate("Too", "Old", getDobFromAge(30), "male", "professional");
    const user5 = userModel.generate("Wrong", "Gender", getDobFromAge(23), "female", "professional");
    const user6 = userModel.generate("Other", "Candidate", getDobFromAge(23), "male", "professional");

    return Promise.all([
        userCreationUseCase.createAccount(db, userCol, user1),
        userCreationUseCase.createAccount(db, userCol, user2),
        userCreationUseCase.createAccount(db, userCol, user3),
        userCreationUseCase.createAccount(db, userCol, user4),
        userCreationUseCase.createAccount(db, userCol, user5),
        userCreationUseCase.createAccount(db, userCol, user6)
    ])
}

function createLandlord() {
    const landlord = landlordModel.generate("Landlord", "Account", birthday, "0");
    let uuid;

    return landlordCreationUseCase.createAccount(db, landlordCol, landlord)
        .then((landlord) => uuid = landlord["_id"])
        .then(() => Promise.all([
            landlordRetrievalUseCase.verifyLandlordPhone(db, landlordCol, uuid),
            landlordRetrievalUseCase.verifyLandlordIdentity(db, landlordCol, uuid)
        ]))
        .then(() => uuid)
}

function createListingObject(landlordUuid) {
    const today = new Date();
    let expiry = new Date();
    expiry.setDate(today.getDate() + 21);
    let rent = Math.floor(Math.random() * 2500);

    return Promise.resolve(
        houseShareModel.generate(
            landlordUuid,
            houseShareModel.generateAddress("3", "22", "Goldsmith St.", "Phibsborough", "Dublin", "Dublin", "D07 FK2W"),
            houseShareModel.generateDetails("apartment", "Awesome apartment", 12, 20, 25, ["male"], ["professional"]),
            ["shared", "ensuite", "ensuite"],
            ["single", "double", "shared"],
            houseShareModel.generateFacilities(false, true, true, false, false, true, false),
            houseShareModel.generateListing(rent, rent, "entry", false, true, "B1")
        )
    );
}

describe("api application management", () => {
    beforeEach((done) => {
        dropDb()
            .then(() => seedDb())
            .then(() => {
                oauth = require('../../../common/oauth');
                sinon.stub(oauth, 'denyInvalidRequests').callsFake((req, res, next) => next());
                app = require('../../../app')(env);
                chai.use(chaiHttp);
                done()
            })
            .catch((err) => done(err))
    });

    afterEach((done) => {
        dropDb()
            .then(() => oauth.denyInvalidRequests.restore())
            .then(() => done())
            .catch((err) => done(err));
    });

    it('should return 201 to a new user who makes an application for a fitting listing', (done) => {
        let user = {};
        let listing = {};
        let landlord = {};

        userRetrievalUseCase.getUsers(db, userCol, {"details.forename": "Fitting", "details.surname": "Candidate"})
            .then((_user) => user = _user[0])
            .then(() => landlordRetrievalUseCase.getLandlords(db, landlordCol, {"details.forename": "Landlord"}))
            .then((_landlord) => landlord = _landlord[0])
            .then(() => houseShareRetrievalUseCase.getListings(db, listingCol))
            .then((_listing) => listing = _listing[0])
            .then(() => applicationModel.generate(user["_id"], landlord["_id"], listing["_id"]))
            .then((application) => requestHelper.postResource(app, headers, `/api/v1/application`, application))
            .then((res) => assert.equal(res.status, 201))
            .then(() => applicationRetrievalUseCase.getApplications(db, applicationCol))
            .then((applications) => {
                assert.equal(applications.length, 1);
                assert.equal(applications[0]["user_id"], user["_id"]);
                assert.equal(applications[0]["listing_id"], listing["_id"]);
                assert.equal(applications[0]["landlord_id"], landlord["_id"]);
                done()
            })
            .catch((err) => done(err));
    });

    it('should return 400 to a user who makes an application with missing parameters', (done) => {
        requestHelper.postResource(app, headers, `/api/v1/application`, {
            "user_id": ObjectId(),
            "landlord_id": ObjectId()
        })
            .then(() => done(new Error("Incorrectly created application with missing params")))
            .catch((err) => {
                assert.equal(err.response.status, 400);
                done()
            });
    });

    it('should return 403 to a new user (too young) who makes an application for a non-fitting listing', (done) => {
        let user = {};
        let listing = {};
        let landlord = {};

        userRetrievalUseCase.getUsers(db, userCol, {"details.forename": "Too", "details.surname": "Young"})
            .then((_user) => user = _user[0])
            .then(() => landlordRetrievalUseCase.getLandlords(db, landlordCol, {"details.forename": "Landlord"}))
            .then((_landlord) => landlord = _landlord[0])
            .then(() => houseShareRetrievalUseCase.getListings(db, listingCol))
            .then((_listing) => listing = _listing[0])
            .then(() => applicationModel.generate(user["_id"], landlord["_id"], listing["_id"]))
            .then((application) => requestHelper.postResource(app, headers, `/api/v1/application`, application))
            .then(() => done(new Error("Incorrectly created application for user below minimum age restrictions")))
            .catch((err) => {
                assert.equal(err.response.status, 403);
                done()
            });
    });

    it('should return 403 to a new user (too old) who makes an application for a non-fitting listing', (done) => {
        let user = {};
        let listing = {};
        let landlord = {};

        userRetrievalUseCase.getUsers(db, userCol, {"details.forename": "Too", "details.surname": "Old"})
            .then((_user) => user = _user[0])
            .then(() => landlordRetrievalUseCase.getLandlords(db, landlordCol, {"details.forename": "Landlord"}))
            .then((_landlord) => landlord = _landlord[0])
            .then(() => houseShareRetrievalUseCase.getListings(db, listingCol))
            .then((_listing) => listing = _listing[0])
            .then(() => applicationModel.generate(user["_id"], landlord["_id"], listing["_id"]))
            .then((application) => requestHelper.postResource(app, headers, `/api/v1/application`, application))
            .then(() => done(new Error("Incorrectly created application for user above maximum age restrictions")))
            .catch((err) => {
                assert.equal(err.response.status, 403);
                done()
            });
    });

    it('should return 403 to a new user (wrong profession) who makes an application for a non-fitting listing', (done) => {
        let user = {};
        let listing = {};
        let landlord = {};

        userRetrievalUseCase.getUsers(db, userCol, {"details.forename": "Wrong", "details.surname": "Profession"})
            .then((_user) => user = _user[0])
            .then(() => landlordRetrievalUseCase.getLandlords(db, landlordCol, {"details.forename": "Landlord"}))
            .then((_landlord) => landlord = _landlord[0])
            .then(() => houseShareRetrievalUseCase.getListings(db, listingCol))
            .then((_listing) => listing = _listing[0])
            .then(() => applicationModel.generate(user["_id"], landlord["_id"], listing["_id"]))
            .then((application) => requestHelper.postResource(app, headers, `/api/v1/application`, application))
            .then(() => done(new Error("Incorrectly created application for user with non-accepted profession")))
            .catch((err) => {
                assert.equal(err.response.status, 403);
                done()
            });
    });

    it('should return 403 to a new user (wrong gender) who makes an application for a non-fitting listing', (done) => {
        let user = {};
        let listing = {};
        let landlord = {};

        userRetrievalUseCase.getUsers(db, userCol, {"details.forename": "Wrong", "details.surname": "Gender"})
            .then((_user) => user = _user[0])
            .then(() => landlordRetrievalUseCase.getLandlords(db, landlordCol, {"details.forename": "Landlord"}))
            .then((_landlord) => landlord = _landlord[0])
            .then(() => houseShareRetrievalUseCase.getListings(db, listingCol))
            .then((_listing) => listing = _listing[0])
            .then(() => applicationModel.generate(user["_id"], landlord["_id"], listing["_id"]))
            .then((application) => requestHelper.postResource(app, headers, `/api/v1/application`, application))
            .then(() => done(new Error("Incorrectly created application for user with non-accepted sex")))
            .catch((err) => {
                assert.equal(err.response.status, 403);
                done()
            });
    });

    it('should return 404 to a new user who makes an application for a non-existent listing', (done) => {
        let user = {};
        let landlord = {};

        userRetrievalUseCase.getUsers(db, userCol, {"details.forename": "Wrong", "details.surname": "Gender"})
            .then((_user) => user = _user[0])
            .then(() => landlordRetrievalUseCase.getLandlords(db, landlordCol, {"details.forename": "Landlord"}))
            .then((_landlord) => landlord = _landlord[0])
            .then(() => applicationModel.generate(user["_id"], landlord["_id"], ObjectId()))
            .then((application) => requestHelper.postResource(app, headers, `/api/v1/application`, application))
            .then(() => done(new Error("Incorrectly created application for user with non-existing listing")))
            .catch((err) => {
                assert.equal(err.response.status, 404);
                done()
            });
    });

    it('should return 404 to a non-existent user who makes an application for a listing', (done) => {
        let listing = {};
        let landlord = {};

        landlordRetrievalUseCase.getLandlords(db, landlordCol, {"details.forename": "Landlord"})
            .then((_landlord) => landlord = _landlord[0])
            .then(() => houseShareRetrievalUseCase.getListings(db, listingCol))
            .then((_listing) => listing = _listing[0])
            .then(() => applicationModel.generate(ObjectId(), landlord["_id"], listing["_id"]))
            .then((application) => requestHelper.postResource(app, headers, `/api/v1/application`, application))
            .then(() => done(new Error("Incorrectly created application for user with non-existing listing")))
            .catch((err) => {
                assert.equal(err.response.status, 404);
                done()
            });
    });

    it('should return 404 to a user who makes an application for a listing with a non-existent landlord', (done) => {
        let user = {};
        let listing = {};

        userRetrievalUseCase.getUsers(db, userCol, {"details.forename": "Wrong", "details.surname": "Gender"})
            .then((_user) => user = _user[0])
            .then(() => houseShareRetrievalUseCase.getListings(db, listingCol))
            .then((_listing) => listing = _listing[0])
            .then(() => applicationModel.generate(user["_id"], ObjectId(), listing["_id"]))
            .then((application) => requestHelper.postResource(app, headers, `/api/v1/application`, application))
            .then(() => done(new Error("Incorrectly created application for user with non-existing listing")))
            .catch((err) => {
                assert.equal(err.response.status, 404);
                done()
            });
    });

    it('should return 500 to user who is a previous applicant who makes an application for a listing', (done) => {
        let user = {};
        let listing = {};
        let landlord = {};

        userRetrievalUseCase.getUsers(db, userCol, {"details.forename": "Fitting", "details.surname": "Candidate"})
            .then((_user) => user = _user[0])
            .then(() => landlordRetrievalUseCase.getLandlords(db, landlordCol, {"details.forename": "Landlord"}))
            .then((_landlord) => landlord = _landlord[0])
            .then(() => houseShareRetrievalUseCase.getListings(db, listingCol))
            .then((_listing) => listing = _listing[0])
            .then(() => applicationModel.generate(user["_id"], landlord["_id"], listing["_id"]))
            .then((application) => requestHelper.postResource(app, headers, `/api/v1/application`, application))
            .then(() => applicationModel.generate(user["_id"], landlord["_id"], listing["_id"]))
            .then((application) => requestHelper.postResource(app, headers, `/api/v1/application`, application))
            .then(() => done(new Error("Incorrectly allowed a user to apply twice to a listing")))
            .catch((err) => {
                assert.equal(err.response.status, 500);
                done()
            });
    });

    it('should return 500 to new user who makes an application for a fitting non-applicable listing', (done) => {
        let user = {};
        let listing = {};
        let landlord = {};

        userRetrievalUseCase.getUsers(db, userCol, {"details.forename": "Fitting", "details.surname": "Candidate"})
            .then((_user) => user = _user[0])
            .then(() => landlordRetrievalUseCase.getLandlords(db, landlordCol, {"details.forename": "Landlord"}))
            .then((_landlord) => landlord = _landlord[0])
            .then(() => houseShareRetrievalUseCase.getListings(db, listingCol))
            .then((_listing) => {
                listing = _listing[0];
                let uuid = listing["_id"];
                let modifiedListing = listing;
                modifiedListing["listing"]["status"] = "closed";
                return houseShareRetrievalUseCase.modifyListing(db, listingCol, modifiedListing, ObjectId(uuid))
            })
            .then(() => applicationModel.generate(user["_id"], landlord["_id"], listing["_id"]))
            .then((application) => requestHelper.postResource(app, headers, `/api/v1/application`, application))
            .then(() => done(new Error("Incorrectly allowed a fitting user to apply to a non-applicable listing")))
            .catch((err) => {
                assert.equal(err.response.status, 500);
                done()
            });
    });

    it('should return 200 on querying for applications by user id', (done) => {
        let user = {};
        let listing = {};
        let landlord = {};

        userRetrievalUseCase.getUsers(db, userCol, {"details.forename": "Fitting", "details.surname": "Candidate"})
            .then((_user) => user = _user[0])
            .then(() => landlordRetrievalUseCase.getLandlords(db, landlordCol, {"details.forename": "Landlord"}))
            .then((_landlord) => landlord = _landlord[0])
            .then(() => houseShareRetrievalUseCase.getListings(db, listingCol))
            .then((_listing) => listing = _listing[0])
            .then(() => applicationModel.generate(user["_id"], landlord["_id"], listing["_id"]))
            .then((application) => applicationCreationUseCase.createApplication(db, applicationCol, application))
            .then(() => requestHelper.getResource(app, headers, `/api/v1/application?user_id=${uuid}`))
            .then((res) => {
                console.log(res.body);
                assert.equal(res.status, 200);
                assert.equal(res.body.length, 1);
                done()
            })
            .catch((err) => done(err))
    });

    it('should return 200 on querying by application id', (done) => {
        let firstUser = {};
        let listing = {};
        let landlord = {};

        userRetrievalUseCase.getUsers(db, userCol, {"details.forename": "Fitting", "details.surname": "Candidate"})
            .then((_user) => firstUser = _user[0])
            .then(() => landlordRetrievalUseCase.getLandlords(db, landlordCol, {"details.forename": "Landlord"}))
            .then((_landlord) => landlord = _landlord[0])
            .then(() => houseShareRetrievalUseCase.getListings(db, listingCol))
            .then((_listing) => listing = _listing[0])
            .then(() => applicationModel.generate(firstUser["_id"], landlord["_id"], listing["_id"]))
            .then((application) => applicationCreationUseCase.createApplication(db, applicationCol, application))
            .then((application) => requestHelper.getResource(app, headers, `/api/v1/application/${application["_id"]}`))
            .then((res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.length, 1);
                done()
            })
            .catch((err) => done(err))
    });

    it('should return 404 on querying by non-existent application id', (done) => {
        requestHelper.getResource(app, headers, `/api/v1/application/${ObjectId()}`)
            .then(() => done(new Error("Incorrectly returned non-existent application id query")))
            .catch((err) => {
                assert.equal(err.response.status, 404);
                done()
            })
    });

    it('should return 200 and one record on querying for applications by user id where there are other applicants', (done) => {
        let firstUser = {};
        let secondUser = {};
        let listing = {};
        let landlord = {};

        userRetrievalUseCase.getUsers(db, userCol, {"details.forename": "Fitting", "details.surname": "Candidate"})
            .then((_user) => firstUser = _user[0])
            .then(() => userRetrievalUseCase.getUsers(db, userCol, {
                "details.forename": "Other",
                "details.surname": "Candidate"
            }))
            .then((_user) => secondUser = _user[0])
            .then(() => landlordRetrievalUseCase.getLandlords(db, landlordCol, {"details.forename": "Landlord"}))
            .then((_landlord) => landlord = _landlord[0])
            .then(() => houseShareRetrievalUseCase.getListings(db, listingCol))
            .then((_listing) => listing = _listing[0])
            .then(() => applicationModel.generate(firstUser["_id"], landlord["_id"], listing["_id"]))
            .then((application) => applicationCreationUseCase.createApplication(db, applicationCol, application))
            .then(() => applicationModel.generate(secondUser["_id"], landlord["_id"], listing["_id"]))
            .then((application) => applicationCreationUseCase.createApplication(db, applicationCol, application))
            .then(() => requestHelper.getResource(app, headers, `/api/v1/application?user_id=${firstUser["_id"]}`))
            .then((res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.length, 1);
                done()
            })
            .catch((err) => done(err))
    });

    it('should return 400 on querying for applications with non-existent parameters', (done) => {
        requestHelper.getResource(app, headers, `/api/v1/application?bad=param`)
            .then(() => done(new Error("Incorrectly accepted query with bad params on applications")))
            .catch((err) => {
                assert.equal(err.response.status, 400);
                done()
            })
    });

    it('should return 200 on updating an application', (done) => {
        let user = {};
        let listing = {};
        let landlord = {};
        let application = {};

        userRetrievalUseCase.getUsers(db, userCol, {"details.forename": "Fitting", "details.surname": "Candidate"})
            .then((_user) => user = _user[0])
            .then(() => userRetrievalUseCase.getUsers(db, userCol, {
                "details.forename": "Other",
                "details.surname": "Candidate"
            }))
            .then((_landlord) => landlord = _landlord[0])
            .then(() => houseShareRetrievalUseCase.getListings(db, listingCol))
            .then((_listing) => listing = _listing[0])
            .then(() => applicationModel.generate(user["_id"], landlord["_id"], listing["_id"]))
            .then((application) => applicationCreationUseCase.createApplication(db, applicationCol, application))
            .then((_application) => {
                application = _application;
                _application["status"] = "accepted";
                return _application
            })
            .then((application) => requestHelper.patchResource(app, headers, `/api/v1/application/${application["_id"]}`, application))
            .then((res) => {
                assert.equal(res.status, 200);
                assert.equal([res.body].length, 1);
                assert.notEqual(res.body.last_updated, application["last_updated"]);
                done()
            })
            .catch((err) => done(err))
    });

    it('should return 400 on updating an application with bad data', (done) => {
        let user = {};
        let listing = {};
        let landlord = {};

        userRetrievalUseCase.getUsers(db, userCol, {"details.forename": "Fitting", "details.surname": "Candidate"})
            .then((_user) => user = _user[0])
            .then(() => userRetrievalUseCase.getUsers(db, userCol, {
                "details.forename": "Other",
                "details.surname": "Candidate"
            }))
            .then((_landlord) => landlord = _landlord[0])
            .then(() => houseShareRetrievalUseCase.getListings(db, listingCol))
            .then((_listing) => listing = _listing[0])
            .then(() => applicationModel.generate(user["_id"], landlord["_id"], listing["_id"]))
            .then((application) => applicationCreationUseCase.createApplication(db, applicationCol, application))
            .then((application) => {
                application["bad"] = "param";
                return application
            })
            .then((application) => requestHelper.patchResource(app, headers, `/api/v1/application/${application["_id"]}`, application))
            .then(() => done(new Error("Incorrectly validated object not following schema")))
            .catch((err) => {
                assert.equal(err.response.status, 400);
                done()
            })
    });

    it('should return 404 on updating a non-existent application', (done) => {
        let user = {};
        let listing = {};
        let landlord = {};

        userRetrievalUseCase.getUsers(db, userCol, {"details.forename": "Fitting", "details.surname": "Candidate"})
            .then((_user) => user = _user[0])
            .then(() => userRetrievalUseCase.getUsers(db, userCol, {
                "details.forename": "Other",
                "details.surname": "Candidate"
            }))
            .then((_landlord) => landlord = _landlord[0])
            .then(() => houseShareRetrievalUseCase.getListings(db, listingCol))
            .then((_listing) => listing = _listing[0])
            .then(() => applicationModel.generate(user["_id"], landlord["_id"], listing["_id"]))
            .then((application) => applicationCreationUseCase.createApplication(db, applicationCol, application))
            .then((application) => {
                application["status"] = "accepted";
                return application
            })
            .then((application) => requestHelper.patchResource(app, headers, `/api/v1/application/${ObjectId()}`, application))
            .then(() => done("Incorrectly updated a non-existent application resource"))
            .catch((err) => {
                assert.equal(err.response.status, 404);
                done();
            })
    });

    it('should return 200 on deleting an existing application', (done) => {
        let user = {};
        let listing = {};
        let landlord = {};

        userRetrievalUseCase.getUsers(db, userCol, {"details.forename": "Fitting", "details.surname": "Candidate"})
            .then((_user) => user = _user[0])
            .then(() => landlordRetrievalUseCase.getLandlords(db, landlordCol, {"details.forename": "Landlord"}))
            .then((_landlord) => landlord = _landlord[0])
            .then(() => houseShareRetrievalUseCase.getListings(db, listingCol))
            .then((_listing) => listing = _listing[0])
            .then(() => applicationModel.generate(user["_id"], landlord["_id"], listing["_id"]))
            .then((application) => applicationCreationUseCase.createApplication(db, applicationCol, application))
            .then((application) => requestHelper.deleteResource(app, headers, `/api/v1/application/${application["_id"]}`))
            .then((res) => assert.equal(res.status, 200))
            .then(() => applicationRetrievalUseCase.getApplications(db, applicationCol))
            .then((applications) => {
                assert.equal(applications.length, 0);
                done();
            })
            .catch((err) => done(err))
    });

    it('should return 404 on deleting a non-existent application', (done) => {
        requestHelper.deleteResource(app, headers, `/api/v1/application/${ObjectId()}`)
            .then(() => done("Incorrectly deleted a non-existent application resource"))
            .catch((err) => {
                assert.equal(err.response.status, 404);
                done();
            })
    });
});