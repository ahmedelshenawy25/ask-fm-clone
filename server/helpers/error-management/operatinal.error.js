class OperationalError extends Error {
  constructor (message, httpCode) {
    super(message);
    Error.captureStackTrace(this, OperationalError);
    this.httpCode = httpCode;
    this.name = 'OperationalError';
  }
}

module.exports = OperationalError;