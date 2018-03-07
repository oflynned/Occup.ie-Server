const Joi = require("joi");

const schema = Joi.object().keys({
    user_id: Joi.string().required(),
    landlord_id: Joi.string().required(),
    listing_id: Joi.string().required(),
    status: Joi.string().required().valid("pending", "accepted", "rejected", "ceased")
});

const querySchema = Joi.object().keys({
    user_id: Joi.string(),
    landlord_id: Joi.string(),
    listing_id: Joi.string()
});

module.exports = {
    validate: function (o) {
        return Joi.validate(o, schema);
    },

    validateQuery: function (o) {
        return Joi.validate(o, querySchema);
    },

    generate: function (userId, landlordId, listingId) {
        return {
            user_id: userId,
            landlord_id: landlordId,
            listing_id: listingId,
            status: "pending"
        }
    }
};