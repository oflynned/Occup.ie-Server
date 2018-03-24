const Joi = require("joi");

const schema = Joi.object().keys({
    forename: Joi.string().required(),
    surname: Joi.string().required(),
    dob: Joi.date().required(),
    email: Joi.string().email().required(),
    phone_number: Joi.string().required(),
    phone_verified: Joi.boolean(),
    identity_verified: Joi.boolean(),
    profile_picture: Joi.string().required(),
    creation_time: Joi.date().required(),
    google_id: Joi.string().required(),
    google_token: Joi.string().required(),
    firebase_token: Joi.string().required(),
    tos_version_accepted: Joi.number().required(),
    privacy_version_accepted: Joi.number().required()
});

module.exports = {
    validateModel: function (o) {
        return Joi.validate(o, schema)
    },
    validate: function (o) {
        return Joi.validate(o, schema, {allowUnknown: true})
    },
    generate: function (forename, surname, dob, phoneNumber) {
        return {
            forename: forename,
            surname: surname,
            dob: dob,
            email: `${forename}.${surname}@test.com`,
            phone_number: phoneNumber,
            phone_verified: false,
            identity_verified: false,
            profile_picture: "http://users.aber.ac.uk/rbh/britain-ireland/parnell.jpg",
            creation_time: new Date(),
            google_id: "google_id",
            google_token: "google_token",
            firebase_token: "firebase_token",
            tos_version_accepted: 1,
            privacy_version_accepted: 1
        };
    }
};