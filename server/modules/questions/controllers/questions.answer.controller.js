const QuestionsDAL = require('@QuestionsDAL');

module.exports = async (req, res, next) => {
  try {
    const { userId } = req;
    const { questionId } = req.params;
    const { answer } = req.body;

    const question = await QuestionsDAL.findQuestionById(questionId, userId);
    if (!question) {
      throw new Error('Question not found');
    }

    await QuestionsDAL.answer(questionId, answer);

    return res.status(204).json();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};