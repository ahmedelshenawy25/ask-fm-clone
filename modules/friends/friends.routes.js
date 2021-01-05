const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const validator = require('@validator');
const { followValidator, unfollowValidator, friendsValidator, discoverValidator } = require('./validators');
const friendsControllers = require('./controllers');

router.get('/friends', [auth, validator(friendsValidator)], friendsControllers.friends);
router.get('/discover', [auth, validator(discoverValidator)], friendsControllers.discover);
router.post('/:username/follow', [auth, validator(followValidator)], friendsControllers.follow);
router.delete('/:username/follow', [auth, validator(unfollowValidator)], friendsControllers.unfollow);

module.exports = router;