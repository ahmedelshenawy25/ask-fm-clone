const QuestionsDAL = require('@QuestionsDAL');
const FollowsDAL = require('@FollowsDAL');

module.exports = async (req, res, next) => {
  try {
    const { userId } = req;
    const { page, limit } = req.query;

    let questions = [];
    const skip = (page - 1) * limit;

    const followedUsersIds = await FollowsDAL.findUserFriendsIds(userId);
    const questionsCount = await QuestionsDAL.findFollowedUsersAnsweredQuestionsCount({
      recipientIds: followedUsersIds
    });
    if (!questionsCount)
      return res.status(200).json({ questions, questionsCount });

    questions = await QuestionsDAL.findFollowedUsersAnsweredQuestions({
      recipientIds: followedUsersIds,
      skip,
      limit
    });

    return res.status(200).json({ questions, questionsCount });
  } catch (error) {
    next(error);
  }
};