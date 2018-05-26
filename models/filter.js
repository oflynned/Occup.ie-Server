const Joi = require("joi");

const querySchema = Joi.object().keys({
    query: {
        min_lease_length: Joi.number().min(1),
        max_lease_length: Joi.number().min(1).when("min_lease_length", {is: 'fieldValue', then: Joi.number().min(Joi.ref("min_lease_length"))}),
        min_bedrooms: Joi.number().min(1),
        max_bedrooms: Joi.number().min(1).when("min_bedrooms", {is: 'fieldValue', then: Joi.number().min(Joi.ref("min_bedrooms"))}),
        min_bathrooms: Joi.number().min(1),
        max_bathrooms: Joi.number().min(1).when("min_bathrooms", {is: 'fieldValue', then: Joi.number().min(Joi.ref("min_bathrooms"))}),
        min_rent: Joi.number().min(1),
        max_rent: Joi.number().min(1).when("min_rent", {is: 'fieldValue', then: Joi.number().min(Joi.ref("min_rent"))}),
        county: Joi.array().items(Joi.string()),
        age: Joi.number().min(18),
        sex: Joi.string().valid("male", "female", "other", "couple"),
        profession: Joi.string().valid("student", "professional", "other"),
        dwelling: Joi.array().items(Joi.string().valid("studio", "house", "apartment")).min(1),
        landlord_uuid: Joi.string(),
        limit: Joi.number(),
        offset: Joi.number(),
        status: Joi.string().valid("active", "paused", "expired")
    },

    order: {
        time_renewed: Joi.string().valid("ascending", "descending"),
        cost: Joi.string().valid("ascending", "descending")
    }
});

module.exports = {
    validateQuery: function (o) {
        return Joi.validate(o, querySchema);
    }
};