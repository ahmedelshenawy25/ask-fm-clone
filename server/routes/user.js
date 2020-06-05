const express = require('express');
const auth = require('../middleware/auth');
const usersControllers = require('../modules/users/controllers');
const {
  search, follow, unfollow, friends, discover
} = require('../controllers/user');

const router = express.Router();

router.post('/signup', usersControllers.signup);
router.post('/login', usersControllers.login);

router.get('/search', auth, search);
router.get('/friends', auth, friends);
router.get('/discover', auth, discover);

router.post('/follow/:username', auth, follow);
router.delete('/unfollow/:username', auth, unfollow);

module.exports = router;