const OperationalError = require('@helpers/error-management/operatinal.error');
const jwt = require('jsonwebtoken');

function auth (req, res, next) {
  try {
    const [, token] = req.header('Authorization').split('Bearer ');
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.userId = decoded._id;

    return next();
  } catch (error) {
    next(new OperationalError('Invalid token.', 401));
  }
}

module.exports = auth;