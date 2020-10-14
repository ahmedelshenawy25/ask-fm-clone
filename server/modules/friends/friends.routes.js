const express = require('express');
const router = express.Router();
const friendsControllers = require('./controllers');
const auth = require('../../middleware/auth');

router.get('/friends', auth, friendsControllers.friends);
router.get('/discover', auth, friendsControllers.discover);

router.post('/follow/:username', auth, friendsControllers.follow);
router.delete('/unfollow/:username', auth, friendsControllers.unfollow);

module.exports = router;