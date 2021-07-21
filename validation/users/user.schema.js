const Joi = require('@hapi/joi')

const schema = {
    user: Joi.object({
    name: Joi.string().lowercase().required(),
    phone: Joi.number().integer().min(1000000000).message("invalid phone number ").max(9999999999).message("invalid phone number "),
    email: Joi.string().lowercase().email({ minDomainSegments:3,tlds:{allow:['siesgst.ac.in' , 'gst.sies.edu.in']}}),
    password: Joi.string().lowercase().required()
  })
};

module.exports = schema;