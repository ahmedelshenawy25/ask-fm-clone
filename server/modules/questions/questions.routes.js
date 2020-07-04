const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const questionsControllers = require('./controllers');
const auth = require('../../middleware/auth');

// fetch all answered questions by followed users
router.get('/home', auth, questionsControllers.home);
// fetch all unanswered questions for logged in user
router.get('/account/inbox', auth, questionsControllers.unanswered);
// fetch all answered questions for a specific user
router.get('/user/:username', auth, questionsControllers.answered);

// ask a question
router.post('/:username/ask', auth, questionsControllers.ask);
// answer a question
router.put('/answer/:questionId', auth, questionsControllers.answer);
// delete a question
router.delete('/delete/:questionId', auth, questionsControllers.delete);

module.exports = router;