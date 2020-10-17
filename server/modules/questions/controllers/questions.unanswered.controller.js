const QuestionsDAL = require('@QuestionsDAL');

module.exports = async (req, res, next) => {
  try {
    const { userId } = req;
    const { page, limit } = req.query;

    const skip = (page - 1) * limit;

    const questionsCount = await QuestionsDAL.findUserUnansweredQuestionsCount(userId);
    if (!questionsCount) return res.status(200).json({ questions: [], questionsCount });

    const questions = await QuestionsDAL.findUserUnansweredQuestions({
      recipientId: userId,
      skip,
      limit: +limit
    });

    return res.status(200).json({ questions, questionsCount });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};