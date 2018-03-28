let chai = require("chai");

function getMockRequest(app, headers) {
    let req = chai.request(app);
    for (let k in headers) {
        req.set(k, headers[k]);
    }

    return req;
}

function postResource(app, headers, endpoint, data) {
    return new Promise((res, rej) => {
        chai.request(app)
            .post(endpoint)
            .set("oauth_id", headers["oauth_id"])
            .set("oauth_provider", headers["oauth_provider"])
            .set("Authorization", headers["Authorization"])
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
            .set("Authorization", headers["Authorization"])
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
            .set("Authorization", headers["Authorization"])
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
            .set("Authorization", headers["Authorization"])
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