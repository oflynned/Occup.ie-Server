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
    },

    landlord_uuid: Joi.string(),
    details: {
        dwelling: Joi.valid(["apartment", "house", "flat"]),
        description: Joi.string(),
        lat: Joi.number(),
        lng: Joi.number(),
        move_in_date: Joi.date(),
        lease_length: Joi.number(),
        min_target_age_category: Joi.number(),
        max_target_age_category: Joi.number(),
        target_sex: Joi.string().valid(["male", "female", "other"])
    },
    bathrooms: Joi.array().items(Joi.object({
        size: Joi.string().valid(["ensuite", "separate"])
    })),
    bedrooms: Joi.array().items(Joi.object({
        size: Joi.string().valid(["single", "double", "twin"]),
        monthly_cost: Joi.number()
    })),
    images: Joi.array().items(Joi.object({
        uuid: Joi.string()
    })),
    facilities: {
        furnished: Joi.boolean(),
        bill_estimate: Joi.string(),
        ber: Joi.string()
    },
    listing: {
        created: Joi.date(),
        updated: Joi.date(),
        expiry: Joi.date(),
        plan: Joi.string(),
        status: Joi.string()
    }
});

function validate(o) {
    return Joi.validate(o, schema);
}

module.exports = {
    validate: validate
};
