const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const validator = require('@validator');
const { followValidator, unfollowValidator } = require('./validators');
const friendsControllers = require('./controllers');

router.get('/friends', auth, friendsControllers.friends);
router.get('/discover', auth, friendsControllers.discover);

router.post('/follow/:username', [auth, validator(followValidator)], friendsControllers.follow);
router.delete('/unfollow/:username', [auth, validator(unfollowValidator)], friendsControllers.unfollow);

module.exports = router;