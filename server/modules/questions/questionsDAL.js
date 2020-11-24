const Question = require('./questions.model');

class QuestionsDAL {
  async findQuestionById (questionId, recipientId) {
    const question = await Question.findOne({
      _id: questionId,
      recipient: recipientId
    });
    return question;
  }

  async create (question) {
    await Question.create(question);
  }

  async answer (questionId, answer) {
    await Question.updateOne({ _id: questionId }, { answer, answered: true });
  }

  async delete (questionId) {
    await Question.deleteOne({ _id: questionId });
  }

  async findUserUnansweredQuestions ({ recipientId, skip, limit }) {
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
      .sort('-createdAt')
      .skip(skip)
      .limit(limit)
      .populate('sender', '-_id firstName lastName username');

    return this._removeAnonymousSender(unansweredQuestions);
  }

  async findUserUnansweredQuestionsCount (recipientId) {
    const unansweredQuestionsCount = await Question.countDocuments(
      {
        recipient: recipientId,
        answered: false
      }
    );

    return unansweredQuestionsCount;
  }

  async findUserAnsweredQuestions ({ recipientId, skip, limit }) {
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
      .sort('-updatedAt')
      .skip(skip)
      .limit(limit)
      .populate('sender', '-_id firstName lastName username');

    return this._removeAnonymousSender(answeredQuestions);
  }

  async findUserAnsweredQuestionsCount (recipientId) {
    const answeredQuestionsCount = await Question.countDocuments(
      {
        recipient: recipientId,
        answered: true
      }
    );

    return answeredQuestionsCount;
  }

  async findFollowedUsersAnsweredQuestions ({ recipientIds, skip, limit }) {
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
      .sort('-updatedAt')
      .skip(skip)
      .limit(limit)
      .populate('recipient', '-_id firstName lastName username')
      .populate('sender', '-_id firstName lastName username');

    return this._removeAnonymousSender(followedUsersAnsweredQuestions);
  }

  async findFollowedUsersAnsweredQuestionsCount ({ recipientIds }) {
    const followedUsersAnsweredQuestionsCount = await Question.countDocuments(
      {
        recipient: { $in: recipientIds },
        answered: true
      }
    );
    return followedUsersAnsweredQuestionsCount;
  }

  _removeAnonymousSender (questions) {
    return questions.map((question) => {
      question.sender = question.isAnonymous ? undefined : question.sender;
      return question;
    });
  }
}

module.exports = new QuestionsDAL();