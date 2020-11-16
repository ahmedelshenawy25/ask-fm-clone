const QuestionsDAL = require('@QuestionsDAL');
const { QUESTION_NOT_FOUND } = require('../errors');
const { ResourceNotFoundError } = require('@helpers/error-management/common.errors');

module.exports = async (req, res, next) => {
  try {
    const { userId } = req;
    const { questionId } = req.params;

    const question = await QuestionsDAL.findQuestionById(questionId, userId);
    if (!question)
      throw ResourceNotFoundError(QUESTION_NOT_FOUND);

    await QuestionsDAL.delete(questionId);

    return res.status(204).json();
  } catch (error) {
    next(error);
  }
};