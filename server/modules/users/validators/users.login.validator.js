const joi = require('joi');

const bodySchema = joi.object({
  usernameOrEmail: joi.alternatives()
    .try(
      joi.string()
        .email()
        .trim()
        .lowercase(),
      joi.string()
        .trim()
        .token()
        .lowercase()
        .min(4)
        .max(25)
    )
    .required()
    .label('username or password')
    .error(() => new Error('Invalid username or password')),
  password: joi.string()
    .allow('')
    // max = 64 https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#maximum-password-lengths
    .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,64}$/)
    .required()
    .error(() => new Error('Invalid username or password'))
});

module.exports = {
  bodySchema
};