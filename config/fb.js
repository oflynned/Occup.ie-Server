module.exports = {
    get accessToken() {
        return process.env.FB_ACCESS_TOKEN
    },

    get appId() {
        return process.env.FB_APP_ID
    }
};