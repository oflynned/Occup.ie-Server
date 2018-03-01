const Joi = require("joi");

const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    forename: Joi.string().required(),
    surname: Joi.string().required(),
    facebook_id: Joi.string().required(),
    facebook_token: Joi.string().required(),
    identity_verified: Joi.boolean(),
    profile_picture: Joi.string().required(),
    age: Joi.number().min(18).required(),
    sex: Joi.string().valid("male", "female", "other").required(),
    profession: Joi.valid("student", "professional").required()
});

function generate(forename, surname, age, sex) {
    let user = {
        email: `${forename}.${surname}@test.com`,
        forename: forename,
        surname: surname,
        facebook_id: "this_is_a_fake_fb_id",
        facebook_token: "this_is_a_fake_fb_token",
        identity_verified: false,
        profile_picture: "http://f1.thejournal.ie/media/2013/08/james-larkin-2-337x500.jpg",
        age: age,
        sex: sex,
        profession: "student"
    };
    validate(user);
    return user;
}

function validate(o) {
    return Joi.validate(o, schema);
}

module.exports = {
    generate: generate,
    validate: validate
};