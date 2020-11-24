const joi = require('joi');
const { INVALID_USERNAME_OR_PASSWORD } = require('../errors');

const bodySchema = joi.object({
  usernameOrEmail: joi.alternatives()
    .try(
      joi.string()
        .lowercase()
        .trim()
        .email(),
      joi.string()
        .trim()
        .lowercase()
        .token()
        .min(4)
        .max(25)
    )
    .required()
    .label('username or email'),
  password: joi.string()
    // max = 64 https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#maximum-password-lengths
    .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,64}$/)
    .required()
}).error(() => new Error(INVALID_USERNAME_OR_PASSWORD));

module.exports = {
  bodySchema
};