const path = require('path');
const jwt = require('jsonwebtoken');

const dotenvPath = process.env.NODE_ENV === 'development'
    ? '../config/.env.dev'
    : '../config/.env.prod';

require('dotenv').config({ path: path.join(__dirname, dotenvPath) });

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.userId = decoded._id;
        next();
    } catch (e) {
        res.status(401).send({ message: 'Invalid token.' });
    }
};

module.exports = auth;
