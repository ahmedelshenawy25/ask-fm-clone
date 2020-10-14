const express = require('express');
const router = express.Router();
const usersControllers = require('./controllers');
const auth = require('../../middleware/auth');

router.post('/signup', usersControllers.signup);
router.post('/login', usersControllers.login);

router.get('/search', auth, usersControllers.search);

module.exports = router;