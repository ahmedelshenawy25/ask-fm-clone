const express = require('express');
const auth = require('../middleware/auth');

const {
    signup, login, search, follow, unfollow, friends, discover
} = require('../controllers/user');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.get('/search', auth, search);
router.get('/friends', auth, friends);
router.get('/discover', auth, discover);

router.post('/follow/:username', auth, follow);
router.delete('/unfollow/:username', auth, unfollow);

module.exports = router;
