const UsersDAL = require('@UsersDAL');
const QuestionsDAL = require('@QuestionsDAL');
const FollowsDAL = require('@FollowsDAL');
const { USER_NOT_FOUND } = require('../errors');
const { ResourceNotFoundError } = require('@helpers/error-management/common.errors');

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
      throw ResourceNotFoundError(USER_NOT_FOUND);

    const questionsCount = await QuestionsDAL.findUserAnsweredQuestionsCount(recipient);
    if (questionsCount)
      questions = await QuestionsDAL.findUserAnsweredQuestions({
        recipientId: recipient,
        skip,
        limit
      });

    if (userId !== recipient._id.toString())
      isFollowed = await FollowsDAL.isFollowed(recipient, userId);

    return res.status(200).json({ questions, questionsCount, isFollowed });
  } catch (error) {
    next(error);
  }
};