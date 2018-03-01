const Joi = require("joi");

const schema = Joi.object().keys({
    type: Joi.string().valid("rent", "house_share").required(),
    address: {
        house_number: Joi.string().required(),
        street: Joi.string().required(),
        area: Joi.string().required(),
        city: Joi.string().required(),
        county: Joi.string().required(),
        eircode: Joi.string().required()
    },
    details: {
        dwelling: Joi.valid("studio", "apartment", "house", "room").required(),
        description: Joi.string().required(),
        lat: Joi.number().required(),
        lng: Joi.number().required(),
        stay_caveats: Joi.string(),
        move_in_date: Joi.date().required(),
        lease_length: Joi.number().required(),
        min_target_age_category: Joi.number().min(18).required(),
        max_target_age_category: Joi.number().min(18).required(),
        target_profession: Joi.string().required(),
        target_sex: Joi.string().valid("male", "female", "other", "couple").required()
    },
    bathrooms: Joi.array().items(Joi.object({
        size: Joi.string().valid("ensuite", "separate").required()
    })),
    bedrooms: Joi.array().items(Joi.object({
        size: Joi.string().valid("single", "double", "twin").required(),
        monthly_cost: Joi.number().required(),
        deposit: Joi.number().required()
    })),
    images: Joi.array().items(Joi.string().required()),
    facilities: {
        washing_machine: Joi.boolean(),
        dryer: Joi.boolean(),
        parking: Joi.boolean(),
        furnished: Joi.boolean(),
        wifi: Joi.boolean(),
        central_heating: Joi.boolean()
    },
    listing: {
        landlord_uuid: Joi.string().required(),
        created: Joi.date().required(),
        updated: Joi.date(),
        expires: Joi.date().required(),
        plan: Joi.string().required(),
        status: Joi.string().required(),
        owner_occupied: Joi.boolean().required(),
        furnished: Joi.boolean().required(),
        bill_estimate: Joi.string(),
        ber: Joi.string()
    }
});

function validate(o) {
    return Joi.validate(o, schema);
}

module.exports = {
    validate: validate
};
