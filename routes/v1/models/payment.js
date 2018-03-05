const Joi = require("joi");

const schema = Joi.object.keys({

});

module.exports = {
    validate: function (o) {
        return Joi.validate(o, schema);
    }
};