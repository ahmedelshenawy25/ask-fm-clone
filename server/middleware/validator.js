const joi = require('joi');
const OperationalError = require('@helpers/error-management/operatinal.error');

module.exports = ({ bodySchema, paramsSchema, querySchema }) => {
  if (!bodySchema && !paramsSchema && !querySchema)
    throw new Error('At least one validation schema is required');
  if (isInvalidJoiSchema(bodySchema) ||
      isInvalidJoiSchema(paramsSchema) ||
      isInvalidJoiSchema(querySchema))
    throw new Error('Invalid Joi Schema');

  return (req, res, next) => {
    try {
      if (bodySchema)
        validate(bodySchema, req, 'body');
      if (paramsSchema)
        validate(paramsSchema, req, 'params');
      if (querySchema)
        validate(querySchema, req, 'query');

      return next();
    } catch (error) {
      next(error);
    }
  };
};

function isInvalidJoiSchema (schema) {
  return schema && !joi.isSchema(schema);
}

function validate (schema, req, key) {
  const { value, error } = schema.validate(req[key]);
  if (error)
    throw new OperationalError(error.message, 400, 'ValidationError');
  req[key] = value;
}