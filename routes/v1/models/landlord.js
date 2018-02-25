const Joi = require("joi");

const schema = Joi.object.keys({
    forename: Joi.string(),
    surname: Joi.string(),
    phone_number: Joi.number(),
    phone_verified: Joi.boolean(),
    identity_verified: Joi.boolean(),
    profile_picture: Joi.string()
});

function validate(o) {
    return Joi.validate(o, schema);
}

module.exports = {
    validate: validate
};