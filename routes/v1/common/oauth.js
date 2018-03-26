function validateFacebookToken(id, token) {
    return fetch(`graph.facebook.com/debug_token?input_token=${token}&access_token=${process.env.FACEBOOK_APP_SECRET}`)
        .then((res) => {
            console.log(res);
            switch (res.status) {

            }
        })
}

function validateGoogleToken(id, token) {
    return Promise.resolve(true);
}

module.exports = {
    validateOAuthIdentity: function (req) {
        let id = req["oauth"]["oauth_id"];
        let token = req["oauth"]["oauth_token"];
        let provider = req["oauth"]["oauth_provider"];

        switch (provider) {
            case "facebook":
                return validateFacebookToken(id, token);
            case "google":
                return validateGoogleToken(id, token);
            default:
                return Promise.reject(new Error("bad_request"));
        }
    },
};