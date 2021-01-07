module.exports = {
  ask: require('./questions.ask.controller'),
  answer: require('./questions.answer.controller'),
  delete: require('./questions.delete.controller'),
  friendsQuestions: require('./questions.friendsQuestions.controller'),
  answered: require('./questions.answered.controller'),
  unanswered: require('./questions.unanswered.controller')
};