const UsersDAL = require('../../users/usersDAL');
const QuestionsDAL = require('../questionsDAL');
const Follow = require('../../../models/follow');

module.exports = async (req, res, next) => {
  try {
    const { userId } = req;
    const { username } = req.params;

    const recipient = await UsersDAL.findUserIdByUsername(username);
    if (!recipient) {
      throw new Error('User not found.');
    }

    const questions = await QuestionsDAL.findUserAnsweredQuestions(recipient);

    const followed = await Follow.findOne({
      followedUser: recipient,
      followingUser: userId
    });
    const isFollowed = !!followed;
    // could move that check to frontend if I send username
    const renderFollowButton = userId.toString() !== recipient._id.toString();

    return res.status(200).json({ modifiedQuestions: questions, isFollowed, renderFollowButton });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};