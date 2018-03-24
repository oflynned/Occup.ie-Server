const Joi = require("joi");

const schema = Joi.object().keys({
    details: Joi.object().keys({
        email: Joi.string().email().required(),
        forename: Joi.string().required(),
        surname: Joi.string().required(),
        profile_picture: Joi.string().required(),
        dob: Joi.date().required(),
        sex: Joi.string().valid("male", "female", "other").required(),
        profession: Joi.valid("student", "professional").required(),
    }),

    meta: Joi.object().keys({
        identity_verified: Joi.boolean(),
        creation_time: Joi.date().required(),
        firebase_token: Joi.string().required(),
        tos_version_accepted: Joi.number().required(),
        privacy_version_accepted: Joi.number().required()
    }),

    oauth: Joi.object().keys({
        oauth_provider: Joi.string().required(),
        oauth_id: Joi.string().required(),
        oauth_token: Joi.string().required(),
    })
});

module.exports = {
    generate: function (forename, surname, dob, sex, profession) {
        return {
            details: {
                email: `${forename.toLowerCase()}.${surname.toLowerCase()}@test.com`,
                forename: forename,
                surname: surname,
                profile_picture: "http://f1.thejournal.ie/media/2013/08/james-larkin-2-337x500.jpg",
                dob: dob,
                sex: sex,
                profession: profession,
            },

            meta: {
                identity_verified: false,
                creation_time: new Date(),
                firebase_token: "firebase_token",
                tos_version_accepted: 1,
                privacy_version_accepted: 1
            },

            oauth: {
                oauth_provider: "facebook",
                oauth_id: "facebook_id",
                oauth_token: "facebook_token",
            }
        };
    },
    validateModel: function (o) {
        return Joi.validate(o, schema)
    },
    validate: function (o) {
        return Joi.validate(o, schema, {allowUnknown: true})
    },
    getKeys: function () {
        return Object.keys(schema);
    }
};