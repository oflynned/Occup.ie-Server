const Joi = require("joi");

const schema = Joi.object().keys({
    details: Joi.object().keys({
        forename: Joi.string().required(),
        surname: Joi.string().required(),
        dob: Joi.date().required(),
        email: Joi.string().email().required(),
        profile_picture: Joi.string().required(),
        phone_number: Joi.string().required()
    }),

    meta: Joi.object().keys({
        identity_verified: Joi.boolean(),
        phone_verified: Joi.boolean(),
        creation_time: Joi.date().required(),
        firebase_token: Joi.string().required(),
        tos_version_accepted: Joi.number().required(),
        privacy_version_accepted: Joi.number().required()
    }),

    oauth: Joi.object().keys({
        oauth_provider: Joi.string().required(),
        oauth_id: Joi.string().required()
    }),
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
            details: {
                forename: forename,
                surname: surname,
                dob: dob,
                email: `${forename}.${surname}@test.com`,
                phone_number: phoneNumber,
                profile_picture: "http://users.aber.ac.uk/rbh/britain-ireland/parnell.jpg",
            },

            meta: {
                phone_verified: false,
                identity_verified: false,
                creation_time: new Date(),
                firebase_token: "firebase_token",
                tos_version_accepted: 1,
                privacy_version_accepted: 1
            },

            oauth: {
                oauth_provider: "google",
                oauth_id: "google_id",
            }
        };
    }
};