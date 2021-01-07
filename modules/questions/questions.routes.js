const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const validator = require('@validator');
const questionsControllers = require('./controllers');
const { answerValidator, answeredValidator, askValidator, deleteValidator, friendsQuestionsValidator, unansweredValidator } = require('./validators');

router.get('/answered', [auth, validator(friendsQuestionsValidator)], questionsControllers.friendsQuestions);
router.get('/unanswered', [auth, validator(unansweredValidator)], questionsControllers.unanswered);
router.get('/:username/answered', [auth, validator(answeredValidator)], questionsControllers.answered);
router.post('/:username', [auth, validator(askValidator)], questionsControllers.ask);
router.put('/:questionId', [auth, validator(answerValidator)], questionsControllers.answer);
router.delete('/:questionId', [auth, validator(deleteValidator)], questionsControllers.delete);

module.exports = router;