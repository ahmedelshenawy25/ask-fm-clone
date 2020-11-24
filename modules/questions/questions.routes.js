const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const validator = require('@validator');
const questionsControllers = require('./controllers');
const { answerValidator, answeredValidator, askValidator, deleteValidator, homeValidator, unansweredValidator } = require('./validators');

// fetch all answered questions by followed users
router.get('/home', [auth, validator(homeValidator)], questionsControllers.home);
// fetch all unanswered questions for logged in user
router.get('/account/inbox', [auth, validator(unansweredValidator)], questionsControllers.unanswered);
// fetch all answered questions for a specific user
router.get('/user/:username', [auth, validator(answeredValidator)], questionsControllers.answered);

// ask a question
router.post('/:username/ask', [auth, validator(askValidator)], questionsControllers.ask);
// answer a question
router.put('/answer/:questionId', [auth, validator(answerValidator)], questionsControllers.answer);
// delete a question
router.delete('/delete/:questionId', [auth, validator(deleteValidator)], questionsControllers.delete);

module.exports = router;