const Joi = require("@hapi/joi")

const authSchema = Joi.object({
    

    name: Joi.string().lowercase().required(),
    phone: Joi.string(),
    email: Joi.string().lowercase().email(),
    password: Joi.string().lowercase().min(10).required()
})
module.exports =("Auth",authSchema) 