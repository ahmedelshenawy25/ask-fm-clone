const QuestionsDAL = require('@QuestionsDAL');

module.exports = async (req, res, next) => {
  try {
    const { userId } = req;

    const questions = await QuestionsDAL.findUserUnansweredQuestions(userId);

    return res.status(200).json(questions);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};