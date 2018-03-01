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

function generate(forename, surname) {
    let landlord = {
        forename: forename,
        surname: surname,
        phoneNumber: "+353 86 123 4567",
        phone_verified: false,
        identity_verified: false,
        profile_picture: "http://users.aber.ac.uk/rbh/britain-ireland/parnell.jpg"
    };

    validate(landlord, schema);
    return landlord;
}

function validate(o, schema) {
    return Joi.validate(o, schema);
}

module.exports = {
    validate: validate,
    generate: generate
};