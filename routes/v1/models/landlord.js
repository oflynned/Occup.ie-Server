const Joi = require("joi");

const schema = Joi.object().keys({
    forename: Joi.string().required(),
    surname: Joi.string().required(),
    email: Joi.string().email().required(),
    phone_number: Joi.number().required(),
    phone_verified: Joi.boolean(),
    identity_verified: Joi.boolean(),
    profile_picture: Joi.string().required()
});

function generate(forename, surname, email, phoneNumber) {
    return {
        forename: forename,
        surname: surname,
        email: email,
        phone_number: phoneNumber,
        phone_verified: false,
        identity_verified: false,
        profile_picture: "http://users.aber.ac.uk/rbh/britain-ireland/parnell.jpg"
    };
}

function validate(o) {
    return Joi.validate(o, schema);
}

module.exports = {
    validate: validate,
    generate: generate
};