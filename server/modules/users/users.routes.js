const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const usersControllers = require('./controllers');

router.post('/signup', usersControllers.signup);
router.post('/login', usersControllers.login);

module.exports = router;