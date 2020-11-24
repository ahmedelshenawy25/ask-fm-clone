const OperationalError = require('./operatinal.error');

const commonErrors = {
  InvalidInput: { name: 'InvalidInput', httpCode: 400 },
  Unauthorized: { name: 'Unauthorized', httpCode: 401 },
  OperationNotAllowed: { name: 'OperationNotAllowed', httpCode: 403 },
  ResourceNotFound: { name: 'ResourceNotFound', httpCode: 404 },
  Conflict: { name: 'Conflict', httpCode: 409 },
  UnknownError: { name: 'UnknownError', httpCode: 500 }
};

module.exports = {
  InvalidInputError: (message, httpCode, name) => new OperationalError(message, commonErrors.InvalidInput.httpCode, commonErrors.InvalidInput.name),
  UnauthorizedError: (message, httpCode, name) => new OperationalError(message, commonErrors.Unauthorized.httpCode, commonErrors.Unauthorized.name),
  OperationNotAllowedError: (message, httpCode, name) => new OperationalError(message, commonErrors.OperationNotAllowed.httpCode, commonErrors.OperationNotAllowed.name),
  ResourceNotFoundError: (message, httpCode, name) => new OperationalError(message, commonErrors.ResourceNotFound.httpCode, commonErrors.ResourceNotFound.name),
  ConflictError: (message, httpCode, name) => new OperationalError(message, commonErrors.Conflict.httpCode, commonErrors.Conflict.name),
  UnknownError: (message, httpCode, name) => new OperationalError(message, commonErrors.UnknownError.httpCode, commonErrors.Unauthorized.name)
};