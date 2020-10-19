const joi = require('joi');
const customJoi = require('@helpers/custom-validators');

const paramsSchema = joi.object({
  questionId: customJoi.objectId()
    .required()
    .error(() => new Error('Invalid question id'))
});

module.exports = {
  paramsSchema
};