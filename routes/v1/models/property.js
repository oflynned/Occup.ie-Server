const Joi = require("joi");

const schema = Joi.object().keys({
    type: Joi.string().valid(["rent", "house_share"]).required(),
    address: {
        house_number: Joi.string().required(),
        street: Joi.string().required(),
        area: Joi.string().required(),
        city: Joi.string().required(),
        county: Joi.string().required(),
        eircode: Joi.string().required()
    }
});

function validate(payload) {
    return Joi.validate(payload, schema);
}

module.exports = {
    validate: validate
};
