const QuestionsDAL = require('@QuestionsDAL');
const FollowsDAL = require('@FollowsDAL');

module.exports = async (req, res, next) => {
  try {
    const { userId } = req;

    const followedUsersIds = await FollowsDAL.findUserFriendsIds(userId);
    const questions = await QuestionsDAL.findFollowedUsersAnsweredQuestions(followedUsersIds);

    return res.status(200).json(questions);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};