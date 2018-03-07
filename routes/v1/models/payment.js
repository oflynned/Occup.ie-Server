const Joi = require("joi");

const schema = Joi.object.keys({
    landlord_id: Joi.string().required(),
    listing_id: Joi.string().required(),
    amount: Joi.number().required(),
    plan: Joi.string().valid("entry", "medium", "deluxe").required(),
    timestamp: Joi.date().required()
});

module.exports = {
    validate: function (o) {
        return Joi.validate(o, schema);
    }
};