const Joi = require("joi");
let dynamo = require("../persistence/dynamo_db/config");

let property = dynamo.define("Property", {
    hashKey: "uuid",
    timestamps: true,
    schema: {
        type: Joi.string(),
        address: {
            uuid: dynamo.types.uuid(),
            house_number: Joi.number(),
            street: Joi.string(),
            area: Joi.string(),
            city: Joi.string(),
            county: Joi.string(),
            eircode: Joi.string()
        }
    }
});

module.exports = {
    property: property,
    dynamo: dynamo
};