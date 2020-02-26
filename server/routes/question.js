const express = require('express');

const {
    askQuestion,
    answerQuestion,
    deleteQuestion,
    getUnansweredQuestions,
    getAnsweredQuestions,
    getFriendsQuestions
} = require('../controllers/question');
const auth = require('../middleware/auth');

const router = express.Router();

// fetch all answered questions by followed users
router.get('/home', auth, getFriendsQuestions);
// fetch all unanswered questions for logged in user
router.get('/account/inbox', auth, getUnansweredQuestions);
// fetch all answered questions for a specific user
router.get('/user/:username', auth, getAnsweredQuestions);

// ask a question
router.post('/:username/ask', auth, askQuestion);
// answer a question
router.put('/answer/:questionId', auth, answerQuestion);
// delete a question
router.delete('/delete/:questionId', auth, deleteQuestion);

module.exports = router;
