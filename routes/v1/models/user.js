const Joi = require("joi");

const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    forename: Joi.string().required(),
    surname: Joi.string().required(),
    facebook_id: Joi.string().required(),
    facebook_token: Joi.string().required(),
    identity_verified: Joi.boolean(),
    profile_picture: Joi.string().required(),
    dob: Joi.date().required(),
    sex: Joi.string().valid("male", "female", "other").required(),
    profession: Joi.valid("student", "professional").required()
});

module.exports = {
    generate: function (forename, surname, dob, sex, profession) {
        return {
            email: `${forename.toLowerCase()}.${surname.toLowerCase()}@test.com`,
            forename: forename,
            surname: surname,
            facebook_id: `${forename.toLowerCase()}_${surname.toLowerCase()}_fb_id`,
            facebook_token: `${forename.toLowerCase()}_${surname.toLowerCase()}_fb_token`,
            identity_verified: false,
            profile_picture: "http://f1.thejournal.ie/media/2013/08/james-larkin-2-337x500.jpg",
            dob: dob,
            sex: sex,
            profession: profession
        };
    },

    validate: function (o) {
        return Joi.validate(o, schema, {allowUnknown: true})
    }
};