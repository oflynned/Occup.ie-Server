let chai = require("chai");

function postResource(app, headers, endpoint, data) {
    return new Promise((res, rej) => {
        chai.request(app)
            .post(endpoint)
            .set("oauth_id", headers["oauth_id"])
            .set("oauth_provider", headers["oauth_provider"])
            .set("Authorization", `Bearer ${headers["oauth_token"]}`)
            .set('Content-Type', 'application/json')
            .send(data)
            .then((response) => res(response))
            .catch((err) => rej(err))
    })
}

function putResource(app, headers, endpoint, data) {
    return new Promise((res, rej) => {
        chai.request(app)
            .put(endpoint)
            .set("oauth_id", headers["oauth_id"])
            .set("oauth_provider", headers["oauth_provider"])
            .set("Authorization", `Bearer ${headers["oauth_token"]}`)
            .set('Content-Type', 'application/json')
            .send(data)
            .then((response) => res(response))
            .catch((err) => rej(err))
    })
}

function getResource(app, headers, endpoint) {
    return new Promise((res, rej) => {
        chai.request(app)
            .get(endpoint)
            .set("oauth_id", headers["oauth_id"])
            .set("oauth_provider", headers["oauth_provider"])
            .set("Authorization", `Bearer ${headers["oauth_token"]}`)
            .set('Content-Type', 'application/json')
            .then((response) => res(response))
            .catch((err) => rej(err))
    })
}

function deleteResource(app, headers, endpoint) {
    return new Promise((res, rej) => {
        chai.request(app)
            .delete(endpoint)
            .set("oauth_id", headers["oauth_id"])
            .set("oauth_provider", headers["oauth_provider"])
            .set("Authorization", `Bearer ${headers["oauth_token"]}`)
            .set('Content-Type', 'application/json')
            .then((response) => res(response))
            .catch((err) => rej(err))
    })
}

module.exports = {
    getResource: getResource,
    postResource: postResource,
    putResource: putResource,
    deleteResource: deleteResource
};