const joi = require('joi');

const querySchema = joi.object({
  q: joi.string()
    .trim()
    .min(1)
    .max(100)
    .required(),
  page: joi.number()
    .positive()
    .default(1),
  limit: joi.number()
    .positive()
    .default(10)
});

module.exports = {
  querySchema
};