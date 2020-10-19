const joi = require('joi');
const customJoi = require('@helpers/custom-validators');

const bodySchema = joi.object({
  answer: joi.string()
    .trim()
    .allow('')
    .min(1)
    .max(3000)
    .required()
    .error(() => new Error('Answer must have a length between 1 and 3000'))
});

const paramsSchema = joi.object({
  questionId: customJoi.objectId()
    .required()
    .error(() => new Error('Invalid question id'))
});

module.exports = {
  bodySchema,
  paramsSchema
};