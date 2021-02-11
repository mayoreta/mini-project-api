const Joi = require('joi')

module.exports = {
    validateAuth: Joi.object({
        username: Joi.string().min(2).required(),
        password: Joi.string().min(6).required(),
    }),
    validateCreateUser: Joi.object({
        username: Joi.string().min(2).required(),
        password: Joi.string().min(6).required(),
        name: Joi.string(),
        email: Joi.string().email().lowercase(),
        role: Joi.string(),
        address: Joi.string(),
    }),
    validateUpdateUser: Joi.object({
        username: Joi.string().min(2),
        password: Joi.string().min(6),
        name: Joi.string(),
        email: Joi.string().email().lowercase(),
        role: Joi.string(),
        address: Joi.string(),
    })
}