const joi = require('joi');
const { QUESTION_LENGTH } = require('../errors');

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
    .error(() => new Error(QUESTION_LENGTH)),
  isAnonymous: joi.boolean()
    .required()
});

module.exports = {
  paramsSchema,
  bodySchema
};