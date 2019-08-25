require('dotenv').config();
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decoded._id);
        if (!user) {
            throw new Error();
        }

        req.user = user;
        next();
    } catch (e) {
        res.status(401).send({ message: 'Invalid token.' });
    }
};

module.exports = auth;
