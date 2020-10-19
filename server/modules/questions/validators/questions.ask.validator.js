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

const bodySchema = joi.object({
  question: joi.string()
    .trim()
    .min(1)
    .max(300)
    .required()
    .error(() => new Error('Question must have a length between 1 and 300')),
  isAnonymous: joi.boolean()
    .required()
});

module.exports = {
  paramsSchema,
  bodySchema
};