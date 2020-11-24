const joi = require('joi');

const paramsSchema = joi.object({
  username: joi.string()
    .trim()
    .lowercase()
    .token()
    .min(4)
    .max(25)
    .required()
});

module.exports = {
  paramsSchema
};