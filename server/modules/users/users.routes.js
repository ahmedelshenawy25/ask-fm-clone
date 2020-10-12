const express = require('express');
const router = express.Router();
const usersControllers = require('./controllers');
const auth = require('../../middleware/auth');

router.post('/signup', usersControllers.signup);
router.post('/login', usersControllers.login);

router.get('/search', auth, usersControllers.search);

router.get('/friends', auth, usersControllers.friends);
router.get('/discover', auth, usersControllers.discover);

router.post('/follow/:username', auth, usersControllers.follow);
router.delete('/unfollow/:username', auth, usersControllers.unfollow);

module.exports = router;