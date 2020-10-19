const express = require('express');
const router = express.Router();
const validator = require('@validator');
const auth = require('../../middleware/auth');
const { loginValidator, signupValidator, searchValidator } = require('./validators');
const usersControllers = require('./controllers');

router.post('/signup', validator(signupValidator), usersControllers.signup);
router.post('/login', validator(loginValidator), usersControllers.login);

router.get('/search', [auth, validator(searchValidator)], usersControllers.search);

module.exports = router;