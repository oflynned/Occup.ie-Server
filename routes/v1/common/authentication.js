module.exports = {
    validateFacebookToken: function (req, token) {
        // TODO call facebook api to validate token
        return Promise.resolve(true);
    },

    validateGoogleToken: function (req, token) {
        return Promise.resolve(true);
    }
};