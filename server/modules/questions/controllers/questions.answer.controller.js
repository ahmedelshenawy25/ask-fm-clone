const OperationalError = require('@helpers/error-management/operatinal.error');
const QuestionsDAL = require('@QuestionsDAL');

module.exports = async (req, res, next) => {
  try {
    const { userId } = req;
    const { questionId } = req.params;
    const { answer } = req.body;

    const question = await QuestionsDAL.findQuestionById(questionId, userId);
    if (!question)
      throw new OperationalError('Question not found', 400);

    await QuestionsDAL.answer(questionId, answer);

    return res.status(204).json();
  } catch (error) {
    next(error);
  }
};