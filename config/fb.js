module.exports = {
    get appId() {
        return process.env.FACEBOOK_APP_ID
    },

    get appSecret() {
        return process.env.FACEBOOK_APP_SECRET
    }
};