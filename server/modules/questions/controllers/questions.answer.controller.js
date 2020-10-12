const QuestionsDAL = require('@QuestionsDAL');

module.exports = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const { answer } = req.body;

    const question = await QuestionsDAL.findQuestionById(questionId);
    if (!question) {
      throw new Error('Question not found');
    }

    await QuestionsDAL.answerQuestion(questionId, answer);

    return res.status(204).json();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};