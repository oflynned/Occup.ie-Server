let landlord = require("../../models/landlord");

function generateLandlord(data) {
    return landlord.generate("John", "Smith")
}

function validatePayload(data) {
    return landlord.validate(data)
}

function createAccount(data) {

}

module.exports = {

};