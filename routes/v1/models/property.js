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
        lat: Joi.string(),
        lng: Joi.string(),
        move_in_date: Joi.date()
    },
    bathrooms: Joi.array().items(Joi.object({

    })),
    bedrooms: Joi.array().items(Joi.object({

    })),
    facilities: {
        furnished: Joi.boolean(),
        bill_estimate: Joi.string(),
        ber: Joi.string()
    }
});

function validate(payload) {
    return Joi.validate(payload, schema);
}

module.exports = {
    validate: validate
};
