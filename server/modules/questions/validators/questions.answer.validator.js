const joi = require('joi');
const customJoi = require('@helpers/custom-validators');
const { ANSWER_LENGTH, INVALID_QUESTION_ID } = require('../errors');

const bodySchema = joi.object({
  answer: joi.string()
    .trim()
    .min(1)
    .max(3000)
    .required()
    .error(() => new Error(ANSWER_LENGTH))
});

const paramsSchema = joi.object({
  questionId: customJoi.objectId()
    .required()
    .error(() => new Error(INVALID_QUESTION_ID))
});

module.exports = {
  bodySchema,
  paramsSchema
};