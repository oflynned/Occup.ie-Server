let Joi = require("joi");

const schema = Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    time_updated: Joi.date().required(),
    enabled: Joi.boolean().required(),
});

module.exports = {
    validate: function (o) {
        return Joi.validate(o, schema);
    },

    generate: function (name, description, enabled) {
        return {
            name: name,
            description: description,
            time_updated: new Date(),
            enabled: enabled
        }
    }
};