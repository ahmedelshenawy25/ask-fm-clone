const joi = require('joi');
const customJoi = require('@helpers/custom-validators');
const { INVALID_QUESTION_ID } = require('../errors');

const paramsSchema = joi.object({
  questionId: customJoi.objectId()
    .required()
    .error(() => new Error(INVALID_QUESTION_ID))
});

module.exports = {
  paramsSchema
};