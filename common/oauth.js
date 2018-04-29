const fb = require("../config/fb");
let fetch = require("node-fetch");
let ObjectId = require("mongodb").ObjectId;
let record = require("../models/use_cases/common/record");

function validateFacebookToken(id, token) {
    if (id === undefined || id === null || token === undefined || token === null)
        throw new Error("bad_request");

    token = token.replace("Bearer ", "");
    return fetch(`https://graph.facebook.com/debug_token?input_token=${token}&access_token=${fb.appId}|${fb.appSecret}`)
        .then((res) => res.json())
        .then((data) => {
            let resultUserIsValid = data["data"]["is_valid"];
            let resultUserId = data["data"]["user_id"];
            let resultAppId = data["data"]["app_id"];

            if (!resultUserIsValid)
                throw new Error("bad_oauth_token");

            if (resultUserId !== id)
                throw new Error("bad_oauth_id");

            if (resultAppId !== fb.appId)
                throw new Error("bad_app_id");
        })
        .catch(() => {
            throw new Error("oauth_provider_error")
        });
}

function validateGoogleToken(id, token) {

}

function validateOAuthIdentity(req) {
    let payload = req.headers;
    let id = payload["oauth_id"];
    let provider = payload["oauth_provider"];
    let token = payload["authorization"];

    switch (provider) {
        case "facebook":
            return Promise.resolve(validateFacebookToken(id, token));
        case "google":
            return Promise.resolve(validateGoogleToken(id, token));
        default:
            return Promise.reject(new Error("bad_request"));
    }
}

function enforceAccountOwnershipOnResourceAccess(req, env, db) {
    let uuid = req.headers["uuid"];
    let oauthId = req.headers["oauth_id"];
    let accountType = req.headers["account_type"];
    let col = accountType === "landlord" ? env.landlords : env.users;

    if (uuid === undefined || uuid === null || accountType === undefined || accountType === null) {
        // new account creation requests won't have uuids in tenant/landlord
        if (req.method === "POST")
            return Promise.resolve();
        else
            throw new Error("bad_request");
    }

    return record.getRecords(db, col, {"oauth.oauth_id": oauthId, "_id": ObjectId(uuid)})
        .then((records) => {
            if (records.length === 0)
                throw new Error("id_mismatch");
        });
}

function enforceAccountOwnership(req, env, db) {
    let uuid = req.headers["uuid"];
    let oauthId = req.headers["oauth_id"];
    let accountType = req.headers["account_type"];
    let col = accountType === "landlord" ? env.landlords : env.users;

    if (uuid === undefined || uuid === null || accountType === undefined || accountType === null)
        throw new Error("bad_request");

    return record.getRecords(db, col, {"oauth.oauth_id": oauthId, "_id": ObjectId(uuid)})
        .then((records) => {
            if (records.length === 0)
                throw new Error("id_mismatch");
        });
}

module.exports = (env, db) => {
    let module = {};

    module.markInvalidRequests = (req, res, next) => {
        validateOAuthIdentity(req)
            .then(() => {
                req.headers["restricted"] = false;
                next();
            })
            .catch(() => {
                req.headers["restricted"] = true;
                next();
            });
    };

    module.denyInvalidRequests = (req, res, next) => {
        validateOAuthIdentity(req, next)
            .then(() => next())
            .catch((err) => {
                switch (err.message) {
                    case "bad_request":
                        res.status(400).json(err);
                        break;
                    case "bad_app_id":
                    case "bad_oauth_id":
                    case "bad_oauth_token":
                        res.status(401).json(err);
                        break;
                    case "oauth_provider_error":
                    default:
                        res.status(500).json(err);
                        break;
                }
            });
    };

    module.enforceAccountOwnershipOnResourceAccess = (req, res, next) => {
        enforceAccountOwnershipOnResourceAccess(req, env, db)
            .then(() => next())
            .catch((err) => {
                switch (err.message) {
                    case "bad_request":
                        res.status(400).send();
                        break;
                    case "id_mismatch":
                        res.status(401).send();
                        break;
                    default:
                        res.status(500).send();
                        break;
                }
            })
    };

    module.enforceAccountOwnership = (req, res, next) => {
        enforceAccountOwnership(req, env, db)
            .then(() => next())
            .catch((err) => {
                switch (err.message) {
                    case "bad_request":
                        res.status(400).send();
                        break;
                    case "id_mismatch":
                        res.status(401).send();
                        break;
                    default:
                        res.status(500).send();
                        break;
                }
            })
    };

    return module;
};