let fetch = require("node-fetch");

function validateFacebookToken(id, token) {
    const appId = process.env.FACEBOOK_APP_ID;
    const secret = process.env.FACEBOOK_APP_SECRET;
    return fetch(`https://graph.facebook.com/debug_token?input_token=${token}&access_token=${appId}|${secret}`)
        .then((res) => {
            if (res.status !== 200)
                throw new Error("oauth_provider_error");
            return res.json();
        })
        .then((data) => {
            let resultUserIsValid = data["data"]["is_valid"];
            let resultUserId = data["data"]["user_id"];
            let resultAppId = data["data"]["app_id"];

            if (!resultUserIsValid)
                throw new Error("bad_oauth_token");

            if (!resultUserId === id)
                throw new Error("bad_oauth_id");

            if (resultAppId !== appId)
                throw new Error("bad_app_id");
        });
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
                return Promise.resolve(validateFacebookToken(id, token));
            case "google":
                return Promise.resolve(validateGoogleToken(id, token));
            default:
                return Promise.reject(new Error("bad_request"));
        }
    },
};