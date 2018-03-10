const chai = require("chai");
const env = require("../../../config/collections").test;
const app = require("../../../app")(env);

function postResource(endpoint, data) {
    return new Promise((res, rej) => {
        chai.request(app)
            .post(endpoint)
            .set('content-type', 'application/json')
            .send(data)
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

function getResource(endpoint) {
    return new Promise((res, rej) => {
        chai.request(app)
            .get(endpoint)
            .then((response) => res(response))
            .catch((err) => rej(err))
    })
}

function deleteResource(endpoint) {
    return new Promise((res, rej) => {
        chai.request(app)
            .delete(endpoint)
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