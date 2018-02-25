const Joi = require("joi");

const schema = Joi.object.keys({

});

function validate(o) {
    return Joi.validate(o, schema);
}

module.exports = {
    validate: validate
};