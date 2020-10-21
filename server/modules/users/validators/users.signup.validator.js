const joi = require('joi');

const bodySchema = joi.object({
  firstName: joi.string()
    .trim()
    .min(1)
    .max(50)
    .required()
    .label('first name'),
  lastName: joi.string()
    .trim()
    .min(1)
    .max(50)
    .required()
    .label('last name'),
  username: joi.string()
    .trim()
    .lowercase()
    .token()
    .min(4)
    .max(25)
    .required(),
  email: joi.string()
    .trim()
    .lowercase()
    .email()
    .required(),
  password: joi.string()
    .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,64}$/)
    .required()
    .error(() => new Error('Invalid password'))
});

module.exports = {
  bodySchema
};