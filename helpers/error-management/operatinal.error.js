class OperationalError extends Error {
  constructor (message, httpCode, name = 'OperationalError') {
    super(message);
    Error.captureStackTrace(this, OperationalError);
    this.httpCode = httpCode;
    this.name = name;
  }
}

module.exports = OperationalError;