const Question = require('./questions.model');

class QuestionsDAL {
  async findQuestionById (questionId) {
    const question = await Question.findOne({ _id: questionId });
    return question;
  }

  async createQuestion (question) {
    await Question.create(question);
  }

  async answerQuestion (questionId, answer) {
    await Question.updateOne({ _id: questionId }, { answer, answered: true });
  }

  async deleteQuestion (questionId) {
    await Question.deleteOne({ _id: questionId });
  }

  async findUserUnansweredQuestions (recipientId) {
    const unansweredQuestions = await Question.find(
      {
        recipient: recipientId,
        answered: false
      },
      {
        sender: 1,
        question: 1,
        createdAt: 1,
        isAnonymous: 1
      }
    )
      .populate('sender', '-_id firstName lastName')
      .sort('-createdAt');

    return this.removeAnonymousSender(unansweredQuestions);
  }

  async findUserAnsweredQuestions (recipientId) {
    const answeredQuestions = await Question.find(
      {
        recipient: recipientId,
        answered: true
      },
      {
        sender: 1,
        question: 1,
        answer: 1,
        updatedAt: 1,
        isAnonymous: 1
      }
    )
      .populate('sender', '-_id firstName lastName username')
      .sort('-updatedAt');

    return this.removeAnonymousSender(answeredQuestions);
  }

  async findFollowedUsersAnsweredQuestions (recipientIds) {
    const followedUsersAnsweredQuestions = await Question.find(
      {
        recipient: { $in: recipientIds },
        answered: true
      },
      {
        __v: 0,
        createAt: 0
      }
    )
      .populate('recipient', '-_id firstName lastName username')
      .populate('sender', '-_id firstName lastName username')
      .sort('-updatedAt');

    return this.removeAnonymousSender(followedUsersAnsweredQuestions);
  }

  removeAnonymousSender (questions) {
    return questions.map((question) => {
      question.sender = question.isAnonymous ? undefined : question.sender;
      return question;
    });
  }
}

module.exports = new QuestionsDAL();