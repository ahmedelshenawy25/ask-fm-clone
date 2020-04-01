const jwt = require('jsonwebtoken');

function auth (req, res, next) {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.userId = decoded._id;
    next();
  } catch (e) {
    res.status(401).send({ message: 'Invalid token.' });
  }
}

module.exports = auth;