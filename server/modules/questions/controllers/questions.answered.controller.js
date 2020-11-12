const UsersDAL = require('@UsersDAL');
const QuestionsDAL = require('@QuestionsDAL');
const FollowsDAL = require('@FollowsDAL');
const OperationalError = require('@helpers/error-management/operatinal.error');

module.exports = async (req, res, next) => {
  try {
    const { userId } = req;
    const { username } = req.params;
    const { page, limit } = req.query;

    const skip = (page - 1) * limit;
    let questions = [];
    let isFollowed = false;

    const recipient = await UsersDAL.findUserIdByUsername(username);
    if (!recipient)
      throw new OperationalError('User not found', 400);

    const questionsCount = await QuestionsDAL.findUserAnsweredQuestionsCount(recipient);
    if (questionsCount)
      questions = await QuestionsDAL.findUserAnsweredQuestions({
        recipientId: recipient,
        skip,
        limit
      });

    // TODO: remove renderFollowButton
    const renderFollowButton = userId !== recipient._id.toString();
    if (renderFollowButton)
      isFollowed = await FollowsDAL.isFollowed(recipient, userId);


    return res.status(200).json({ questions, questionsCount, isFollowed, renderFollowButton });
  } catch (error) {
    next(error);
  }
};