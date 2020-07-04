const QuestionsDAL = require('../questionsDAL');
const Follow = require('../../../models/follow');

module.exports = async (req, res, next) => {
  try {
    const { userId } = req;

    const followedUsersIds = await Follow.find({
      followingUser: userId
    },
    '-_id followedUser'
    ).distinct('followedUser');

    const questions = await QuestionsDAL.findFollowedUsersAnsweredQuestions(followedUsersIds);

    return res.status(200).send(questions);
  } catch (e) {
    return res.status(400).send({ message: e.message });
  }
};