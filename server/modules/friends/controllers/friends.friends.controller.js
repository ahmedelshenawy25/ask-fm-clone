const FollowsDAL = require('@FollowsDAL');

module.exports = async (req, res, next) => {
  try {
    const { userId } = req;

    const friends = await FollowsDAL.findUserFriends(userId);

    return res.status(200).json(friends);
  } catch (error) {
    next(error);
  }
};