const UsersDAL = require('@UsersDAL');
const FollowsDAL = require('@FollowsDAL');

module.exports = async (req, res, next) => {
  try {
    const { userId } = req;
    const { page, limit } = req.query;

    const skip = (page - 1) * limit;
    let suggestedUsers = [];
    const followedUsersIds = await FollowsDAL.findUserFriendsIds(userId);
    followedUsersIds.push(userId);

    const suggestedUsersCount = await UsersDAL.suggestUnfollowedUsersCount(followedUsersIds);
    if (suggestedUsersCount)
      suggestedUsers = await UsersDAL.suggestUnfollowedUsers({ followedUsersIds, skip, limit });

    return res.status(200).json({ users: suggestedUsers, usersCount: suggestedUsersCount });
  } catch (error) {
    next(error);
  }
};