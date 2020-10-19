const QuestionsDAL = require('@QuestionsDAL');
const FollowsDAL = require('@FollowsDAL');

module.exports = async (req, res, next) => {
  try {
    const { userId } = req;
    const { page, limit } = req.query;

    const skip = (page - 1) * limit;

    const followedUsersIds = await FollowsDAL.findUserFriendsIds(userId);
    const questionsCount = await QuestionsDAL.findFollowedUsersAnsweredQuestionsCount({
      recipientIds: followedUsersIds
    });
    if (!questionsCount) return res.status(200).json({ questions: [], questionsCount });

    const questions = await QuestionsDAL.findFollowedUsersAnsweredQuestions({
      recipientIds: followedUsersIds,
      skip,
      limit
    });

    return res.status(200).json({ questions, questionsCount });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};