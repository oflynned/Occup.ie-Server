const Joi = require("joi");

const schema = Joi.object.keys({
    user_id: Joi.string().required(),
    landlord_id: Joi.string().required(),
    listing_id: Joi.string().required(),
    status: Joi.string().required().valid("pending", "accepted", "rejected", "ceased")
});

function validate(o) {
    return Joi.validate(o, schema);
}

module.exports = {
    validate: validate
};