const FollowsDAL = require('@FollowsDAL');

module.exports = async (req, res, next) => {
  try {
    const { userId } = req;
    const { page, limit } = req.query;

    const skip = (page - 1) * limit;
    let friends = [];

    const friendsCount = await FollowsDAL.findUserFriendsCount(userId);
    if (friendsCount)
      friends = await FollowsDAL.findUserFriends({ userId, skip, limit });

    return res.status(200).json({ users: friends, usersCount: friendsCount });
  } catch (error) {
    next(error);
  }
};