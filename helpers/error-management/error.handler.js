const logger = require('@helpers/logger');
const OperationalError = require('./operatinal.error');

class ErrorHandler {
  registerAllErrorHandlers (app) {
    app.use((err, req, res, next) => {
      const { name, message, stack } = err;
      const { method, url, body, params, query, userId } = req;
      const logObj = { name, method, url, message, body: this.sanitizeObject(body), params, query, stack, userId };

      if (err instanceof OperationalError) {
        logger.warn(logObj);
        return res.status(err.httpCode).json({ message: err.message });
      }

      logger.error(logObj);
      res.status(500).json({ message: 'Internal Server Error' });
      this.crashIfNotOperationalError(err);
    });

    process.on('uncaughtException', (error) => {
      const { message, stack } = error;
      logger.error({ name: 'uncaughtException', message, stack });
      this.crashIfNotOperationalError(error);
    });

    process.on('unhandledRejection', (reason) => {
      const { message, stack } = reason;
      logger.error({ name: 'unhandledRejection', message, stack });
      this.crashIfNotOperationalError(reason);
    });
  }

  crashIfNotOperationalError (error) {
    if (!(error instanceof OperationalError))
      setTimeout(() => {
        logger.info('Shutting app down');
        process.exit(1);
      }, 3000);
  }

  sanitizeObject (obj) {
    // eslint-disable-next-line no-unused-vars
    const { password, ...sanitizedObj } = obj;
    return sanitizedObj;
  }
}

module.exports = ErrorHandler;