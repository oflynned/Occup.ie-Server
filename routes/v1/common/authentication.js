function validateFacebookToken(req, token) {
    return new Promise((rej, res) => {
        // TODO call facebook api to validate token
        res(true);
    });
}

module.exports = {
    validateFacebookToken: validateFacebookToken
};