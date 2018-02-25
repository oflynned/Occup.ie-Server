const Joi = require("joi");

const schema = Joi.object.keys({
    from_uuid: Joi.string(),
    to_uuid: Joi.string(),
    message: Joi.string(),
    time: Joi.date()
});

function validate(o) {
    return Joi.validate(o, schema);
}

module.exports = {
    validate: validate
};