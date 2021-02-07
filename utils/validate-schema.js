const Joi = require('joi')

module.exports = {
    authSchema: Joi.object({
        email: Joi.string().email().lowercase().required(),
        password: Joi.string().min(6).required(),
        name: Joi.string().default('default'),
        role: Joi.number().default(2),
    })
}