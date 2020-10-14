const jwt = require('jsonwebtoken');

function auth (req, res, next) {
  try {
    const [, token] = req.header('Authorization').split('Bearer ');
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.userId = decoded._id;

    return next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
}

module.exports = auth;