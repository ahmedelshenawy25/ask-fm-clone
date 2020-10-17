const UsersDAL = require('@UsersDAL');
const QuestionsDAL = require('@QuestionsDAL');
const FollowsDAL = require('@FollowsDAL');

module.exports = async (req, res, next) => {
  try {
    const { userId } = req;
    const { username } = req.params;
    const { page, limit } = req.query;

    const skip = (page - 1) * limit;
    let questions = [];
    let isFollowed = false;

    const recipient = await UsersDAL.findUserIdByUsername(username);
    if (!recipient) {
      throw new Error('User not found.');
    }

    const questionsCount = await QuestionsDAL.findUserAnsweredQuestionsCount(recipient);
    if (questionsCount) {
      questions = await QuestionsDAL.findUserAnsweredQuestions({
        recipientId: recipient,
        skip,
        limit: +limit
      });
    }

    const renderFollowButton = userId !== recipient._id.toString();
    if (renderFollowButton) {
      isFollowed = await FollowsDAL.isFollowed(recipient, userId);
    }

    return res.status(200).json({ questions, questionsCount, isFollowed, renderFollowButton });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};