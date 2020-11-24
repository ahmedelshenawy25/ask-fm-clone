const joi = require('joi');

const paramsSchema = joi.object({
  username: joi.string()
    .trim()
    .token()
    .lowercase()
    .min(4)
    .max(25)
    .required()
});

const querySchema = joi.object({
  page: joi.number()
    .positive()
    .default(1),
  limit: joi.number()
    .positive()
    .default(10)
});

module.exports = {
  paramsSchema,
  querySchema
};